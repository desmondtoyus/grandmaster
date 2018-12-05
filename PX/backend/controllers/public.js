const jwt = require('jwt-simple');
const C = require('../utils/vars');
const moment = require('moment');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const models = require('../models');
const random_name = require('node-random-name');
const axios = require('axios');
const validators = require('../utils/validators');
var inlineCss = require('nodemailer-juice');

function generateToken(user) {
  const payload = {
    iat: moment().unix(),
    id: user.id,
    zone_id: user.zone_id,
    account_id: user.account_id,
    email: user.email
  };
  return jwt.encode(payload, C.JWT);
}


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'no-reply@pilotx.tv',
    pass: '1Team1Dre@m'
     }
 });
 transporter.use('compile', inlineCss());
async function createUser(data) {
  try {
    const zone = {
      created_at: moment().utc().unix(),
      name: random_name()
    };
    const createdZone = await models.zones.create(zone);
    const account = {
      created_at: moment().utc().unix(),
      name: data.company,
      notes: '',
      status: 'pending',
      approved_at: 0,
      is_zone_master: true,
      zone_id: createdZone.id
    };
    const createdAccount = await models.accounts.create(account);
    const user = {
      password: crypto.pbkdf2Sync(data.password, C.SALT, 24000, 32, 'sha256').toString('base64'),
      last_login: 0,
      created_at: moment().utc().unix(),
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      phone_number: data.phone,
      role: 16,
      recover_code: '',
      recover_expire: 0,
      status: 'pending',
      timezone: 'US/Pacific',
      zone_id: createdZone.id,
      account_id: createdAccount.id,
      scope_zone_id: createdZone.id,
      scope_account_id: createdAccount.id
    };
    await models.users.create(user);
    return true;
  }
  catch(err) {
    return false;
  }
}

exports.login = function(req, res, next) {
  const token = generateToken(req.user);
  const role = req.user.role;
  req.user.scope_account_id = req.user.account_id;
  req.user.scope_zone_id = req.user.zone_id;
  req.user.last_login = moment().utc().unix();
  req.user.save()
    .then(() => {
      res.send({ token: token, role: role });
    })
    .catch(err => {
      res.sendStatus(401);
    })
};

exports.register = function(req, res, next) {
  if (validators.register) {
    models.users.findOne({
      where: {
        email: req.body.email
      }
    })
      .then(user => {
        if (user) {
          res.status(422).send({ msg: 'The email you entered already exists in the system.'});
        }
        else {
          return createUser(req.body)
            .then(response => {
              if (response) {
                res.sendStatus(200);
              }
              else {
                res.status(503).send({ msg: 'Could not send the request at this time. Please try again later.'});
              }
            })
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not send the request at this time. Please try again later.'});
      })
  }
  else {
    res.sendStatus(406);
  }
};

exports.recover = function(req, res, next) {
  if (validators.recover(req.body)) {
    axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${C.KEY}&response=${req.body.reCaptcha}`)
      .then(response => {
        if (response.data.success) {
          models.users.findOne({
            where: {
              email: req.body.email
            }
          })
            .then(user => {
              if (user) {
                const pass = randomCode();
                user.password = crypto.pbkdf2Sync(pass, C.SALT, 24000, 32, 'sha256').toString('base64');
                user.save()
                  .then(() => {
                    const mailOptions = {
                      from: 'no-reply@pilotx.tv',
                      to: user.email,
                      subject: 'PilotX Password Reset Notification',
                      html: `<style>div { color:#597c94; }</style><div><b>Hello ${user.first_name},</b><br/> Your new password to the PilotX platform is: ${pass}.<br/> You can login at: https://trade.pilotx.tv <br/><br/><br/><br/><hr/></div>`
                    };

                    transporter.sendMail(mailOptions, function (err, info) {
                      if(err)
                        console.log(err)
                      else
                        console.log('Email Sent');
                   });
                    res.sendStatus(200);
                  })
                  .catch(err => {
                    res.sendStatus(503);
                  })
              }
              else {
                res.sendStatus(404);
                // console.log('USER NOT FOUND')
              }
            })
            .catch(err => {
              res.sendStatus(503);
            })
        }
        else {
          res.sendStatus(401);
        }
      })
      .catch(err => {
        res.sendStatus(503);
      });
  }
  else {
    res.sendStatus(406);
  }
};

function randomCode() {
  let code = '';
  const possible ='ABCEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 10; i++) {
    code += possible.charAt(Math.floor(Math.random() * 60));
  }
  return code;
}