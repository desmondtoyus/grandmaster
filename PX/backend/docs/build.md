### Build process

* Build process assumes use of `nginx` server.

##### Server setup

* Install Node.js version 8
    
    * `cd ~`
    * `curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh`
    * `sudo bash nodesource_setup.sh`
    * `sudo apt-get install nodejs`
    * `sudo apt-get install build-essential`
    
* Clone the repository into `/var/deploy`

* Run `npm install` from inside the repository to install npm packages.

* Create file with the name `.env` in the root folder. The file shall include at least the following 2 lines: 
    * `NODE_ENV=development` the NODE_ENV shall be changed depends on the environment. Either test or productuction.
    * `FFPROBE_PATH=/var/deploy/armada_services/node_modules/ffprobe`
    * Any other desired environment variables can be assigned here.
    
* Install PM2

    * `sudo npm install -g pm2`
    * In the `armada_services` folder run `pm2 start index.js -i 0 --name "anthem" --watch`
    * Useful commands:
        * `pm2 restart anthem` - Restarting the node app.
        * `pm2 logs anthem --lines xxxx` Display log with the number of desired lines.
        * `pm2 status` display the status of the running app.

* Set up nginx as a reverse proxy server

    * Add the following to the `/etc/nginx/sites-available/defaut` file.
    
    
   ```
   server_name anthemx.tv;
   
   location / {
        proxy_pass http://localhost:8080
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
   }
   ```
   
   Check errors by running `sudo nginx -t`.
   
   Restart nginx by running `sudo systemctl restart nginx`
   
* Add file size upload setting

    * Update file `/etc/nginx/nginx.conf`
    * Inside the `http` bracket add the line `client_max_body_size 10M;`.