#!/bin/bash


BWA_OPS_S3='s3://bwa-devops-assets'

#############
# Utilities #
#############

# Fatal handler
function _die()
{
	local unknownerr='Unknown error'
	local message=${1:-$unknownerr}
	local code=${2:-$?}
	if [ ! -z "${message}" ]; then
		echo "FATAL: ${message}"
	fi
	[[ ${code} -ne 0 ]] || code=1
	exit ${code}
}




sudo apt-get update -y

## this is a temporary thing - there's some bug in
## the AWS distro of ubuntu that forces one to go through
## a couple of context menus.
sudo rm /boot/grub/menu.lst
sudo update-grab-legacy-ec2 -y
sudo apt-get dist-upgrade -qq --force-yes



sudo apt-get upgrade -y
curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh
sudo sh nodesource_setup.sh
sudo apt-get install postfix nginx nodejs build-essential -y
sudo mkdir -p /var/deploy
cd /var/deploy/
sudo chmod -R 0755 .
sudo chown -R ubuntu:ubuntu .



# Setup root's SSH folder if necessary
if [[ ! -d ~/.ssh/ ]]; then
	mkdir -p ~/.ssh/ || _die "Failure creating /root/.ssh/ folder!"
	chmod 700 ~/.ssh/ || _die "Failure changing permissions on /root/.ssh/ folder!"
fi

# Add private key for gitlab access
if [[ ! -f ~/.ssh/gitlab_id_rsa ]]; then
	aws s3 cp "${BWA_OPS_S3}/access/ops-automation/ssh_config" ~/.ssh/config || _die 'Failed to download ssh_config!'
	aws s3 cp "${BWA_OPS_S3}/access/ops-automation/gitlab_id_rsa" ~/.ssh/gitlab_id_rsa || _die 'Failed to download gitlab_id_rsa!'
	chmod 644 ~/.ssh/config || _die 'Failed to set permissions on ssh_config!'
	chmod 600 ~/.ssh/gitlab_id_rsa || _die 'Failed to set permissions on gitlab_id_rsa!'
fi

# Add gitlab to root's known_hosts
ssh-keyscan gitlab.bwaserver.com >> ~/.ssh/known_hosts
chmod 644 ~/.ssh/known_hosts || _die "Failure changing /root/.ssh/known_hosts permissions!"




git clone git@gitlab.bwaserver.com:bluewaterads/armada_services.git
cd armada_services
npm install
printf "NODE_ENV=development\nFFPROBE_PATH=/var/deploy/armada_services/node_modules/ffprobe" > .env
sudo npm install -g pm2 -y
sudo cp config/nginx.conf /etc/nginx/sites-available/default


## now for building the frontend.

cd /var/deploy/
git clone git@gitlab.bwaserver.com:bluewaterads/armada_ui.git
cd armada_ui
npm install
## the qs dependency is not being pulled in.
## this needs to get fixed at some point.
npm install qs
npm run prod


## run the server
cd /var/deploy/armada_services/
pm2 start index.js -i 0 --name "anthem" --watch
