const utils = require('../utils');
const models = require('../models');
const C = require('../utils/vars');
const crypto = require('crypto');
const moment = require('moment');
const actions = require('../utils/actions');
const validators = require('../utils/validators');
const shortid = require('shortid');

function findScopeAccount(user) {
  let options = {
    where: { id: user.scope_account_id }
  };
  options.attributes = ['id', 'name', 'notes', 'is_zone_master'];
  options.include = [
    {
      model: models.zones,
      attributes: ['id']
    }
  ];
  return models.accounts.findOne(options)
    .then(account => {
      return {
        user: user,
        scope_account: account
      }
    })
    .catch(err => {
      return err;
    })
}

exports.scope = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.accounts.findOne({
      where: {
        id: req.body.id
      }
    })
      .then(account => {
        if (account) {
          if (utils.isAllowed(req.user, actions.READ_ACCOUNT, account)) {
            req.user.scope_account_id = account.id;
            req.user.scope_zone_id = account.zone_id;
            return req.user.save()
              .then(response => {
                res.sendStatus(200);
              })
              .catch(err => {
                res.sendStatus(503);
              })
          }
          else {
            res.sendStatus(401);
          }
        }
        else {
          res.sendStatus(404);
        }
      })
      .catch(err => {
        res.sendStatus(503);
      })
  }
  else {
    res.sendStatus(406);
  }
};

exports.read = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.users.findOne({
      where: {
        id: req.body.id
      },
      attributes: ['id', 'email', 'first_name', 'last_name', 'phone_number', 'role', 'status', 'timezone', 'account_id'],
      include: [
        {
          model: models.accounts,
          attributes: ['id', 'name']
        }
      ]
    })
      .then(user => {
        if (user) {
          if (utils.isAllowed(req.user, actions.READ_USER, user)) {
            res.send(user);
          }
          else {
            res.status(401).send({ msg: 'You are not authorized' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not retrieve the user at this time. Please try again later' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: "Could not retrieve the account at this time. Please try again later" });
      })
  }
  else {
    res.status(406).send({ msg: 'Your input is invalid' });
  }
};

exports.list = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_USERS, null)) {
    let options = utils.generateOptions(req.body, 'users');
    options.where.status = {
      $or: ['active', 'inactive']
    };
    if (validators.id(req.body.id)) {
      options.where.account_id = req.body.id;
    }
    else {
      if (req.body.master) {
        options.where.zone_id = req.user.scope_zone_id;
      } else {
        options.where.account_id = req.user.scope_account_id;
      }

    }
    options.attributes = ['id', 'created_at', 'email', 'first_name', 'last_name', 'phone_number', 'role', 'account_id', 'status'];

    models.users.count({
      where: options.where
    })
      .then(count => {
        return models.users.findAll(options)
          .then(results => {
            let payload = {};
            payload.rows = results;
            payload.pagination = {
              currentPage: req.body.currentPage || 1,
              limit: req.body.pageChunk || 15,
              totalPages: Math.ceil(count / (req.body.pageChunk || 15))
            };
            res.json(payload);
          })
          .catch(err => {
            res.status(503).send({ msg: "Could not display users at this time. Please try again later." });
          })
      })
      .catch(err => {
        res.status(503).send({ msg: "Could not display users at this time. Please try again later." });
      })
  }
  else {
    res.status(401).send({ msg: 'Your not authorized for this operation' });
  }
};

exports.readActive = function (req, res, next) {
  const options = {
    where: {
      id: req.user.id
    },
    attributes: ['id', 'email', 'first_name', 'last_name', 'phone_number', 'role', 'account_id', 'scope_account_id', 'timezone', 'zone_id'],
    include: [
      {
        model: models.accounts,
        attributes: ['id', 'name']
      }
    ]
  };
  const findActiveUser = async () => {
    try {
      const activeUser = await models.users.findOne(options);
      return await findScopeAccount(activeUser);
    }
    catch (err) {
      console.log(err);
    }
  };
  findActiveUser()
    .then(user => {
      res.send(user);
    })
    .catch(err => {
      res.status(503).send({ message: "Could not retrieve the user at this time. Please try again later." });
    })
};

exports.listDisabled = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_DISABLED_USERS, null)) {
    let options = utils.generateOptions(req.body, 'users');
    options.where.status = 'disabled';
    if (validators.id(req.body.id)) {
      options.where.account_id = req.body.id
    }
    else {
      if (req.body.master) {
        options.where.zone_id = req.user.scope_zone_id;
      } else {
        options.where.account_id = req.user.scope_accouny_id;
      }
    }
    options.attributes = ['id', 'created_at', 'email', 'first_name', 'last_name', 'phone_number', 'role', 'account_id', 'status'];

    models.users.count({
      where: options.where
    })
      .then(count => {
        return models.users.findAll(options)
          .then(results => {
            let payload = {};
            payload.rows = results;
            payload.pagination = {
              currentPage: req.body.currentPage || 1,
              limit: req.body.pageChunk || 15,
              totalPages: Math.ceil(count / (req.body.pageChunk || 15))
            };
            res.json(payload);
          })
          .catch(err => {
            res.status(503).send({ msg: "Could not display users at this time. Please try again later." });
          })
      })
      .catch(err => {
        res.status(503).send({ msg: "Could not display users at this time. Please try again later." });
      })
  }
  else {
    res.status(401).send({ msg: 'Your not authorized for this operation' });
  }
};

exports.create = function (req, res, next) {
  if (validators.user(req.body, 'create')) {

    models.users.findAndCountAll({
      where: {
        email: req.body.email
      }
    })
      .then((item) => {
        if (!item.count) {
          if (utils.isAllowed(req.user, actions.CREATE_USER, null)) {
            const user = {
              password: crypto.pbkdf2Sync(req.body.password, C.SALT, 24000, 32, 'sha256').toString('base64'),
              last_login: 0,
              created_at: moment().utc().unix(),
              email: req.body.email,
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              phone_number: req.body.phone_number,
              role: req.body.role,
              recover_code: '',
              recover_expire: 0,
              status: 'active',
              timezone: req.user.timezone,
              zone_id: req.user.scope_zone_id,
              account_id: (req.body.account_id) ? (req.body.account_id) : (req.user.scope_account_id),
              scope_zone_id: req.user.scope_zone_id,
              scope_account_id: (req.body.account_id) ? (req.body.account_id) : (req.user.scope_account_id)
            };
            models.users.create(user)
              .then(user => {
                res.sendStatus(200);
              })
              .catch(err => {
                res.status(503).send({ msg: 'Could not create the user at this time. Please try again later 1' });
              })
          }
          else {
            res.status(401).send({ msg: 'Your are not authorized to perform this operation' });
          }
        }
        else {
          res.status(503).send({ msg: 'User Already exists, please edit this user instead' });
        }

      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not create the user at this time. Please try again later2' });
      })




  }
  else {
    res.status(406).send({ msg: 'Your input is invalid' });
  }
};

exports.update = function (req, res, next) {
  if (validators.user(req.body, "update")) {
    models.users.findOne({
      where: {
        id: req.body.id
      }
    })
      .then(user => {
        if (user) {
          if (utils.isAllowed(req.user, actions.UPDATE_USER, user)) {
            user.account_id = req.body.account_id;
            user.password = crypto.pbkdf2Sync(req.body.password, C.SALT, 24000, 32, 'sha256').toString('base64');
            user.email = req.body.email;
            user.first_name = req.body.first_name;
            user.last_name = req.body.last_name;
            user.phone_number = req.body.phone_number;
            user.role = req.body.role;
            return user.save()
              .then(response => {
                res.sendStatus(200);
              })
              .catch(err => {
                res.status(503).send({ msg: 'Could not update the user at this time. Please try again later.' });
              })
          }
          else {
            res.status(401).send({ msg: 'Your are not authorized to perform this operation' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not update the user at this time. Please try again later.' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not update the user at this time. Please try again later.' });
      })
  }
  else {
    res.status(406).send({ msg: 'Your input is invalid' });
  }
};

exports.delete = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.users.findOne({
      where: {
        id: req.body.id
      }
    })
      .then(user => {
        if (user) {
          if (utils.isAllowed(req.user, actions.DELETE_USER, user)) {
            if (req.user.id === user.id) {
              res.status(403).send({ msg: 'You are not allowed to delete your own user' });
            }
            else {
              user.status = 'disabled';
              user.email = `${user.id}_${shortid.generate()}@detleted.it`;
              user.save()
                .then(response => {
                  res.sendStatus(200);
                })
                .catch(err => {
                  res.status(503).send({ message: 'Could not delete the user at this time. Please try again later' });
                })
            }
          }
          else {
            res.status(401).send({ msg: 'You are not permitted to do this operation' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not delete the user at this time. Please try again later' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not delete the account at this time. Please try again later' });
      })
  }
  else {
    res.status(406).send({ msg: 'Data is invalid' });
  }
};

exports.timezone = function (req, res, next) {
  const timezones = ['US/Pacific', 'US/Eastern', 'UTC'];
  if (req.body.hasOwnProperty('timezone') && timezones.includes(req.body.timezone)) {
    req.user.timezone = req.body.timezone;
    req.user.save()
      .then(user => {
        const payload = {};
        payload.user = {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          role: user.role,
          timezone: user.timezone
        };
        return models.accounts.findOne({
          where: {
            id: user.scope_account_id
          },
          attributes: ['id', 'name', 'notes']
        })
          .then(account => {
            payload.scope_account = {
              id: account.id,
              name: account.name,
              notes: account.notes
            };
            res.send(payload);
          })
          .catch(err => {
            res.sendStatus(503);
          })
      })
      .catch(err => {
        res.sendStatus(503);
      })
  }
  else {
    res.sendStatus(406);
  }
};

exports.activate = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.users.findOne({
      where: {
        id: req.body.id
      }
    })
      .then(user => {
        if (user) {
          if (utils.isAllowed(req.user, actions.ACTIVATE_USER, user)) {
            user.status = 'active';
            return user.save()
              .then(response => {
                res.sendStatus(200);
              })
              .catch(err => {
                res.status(503).send({ msg: 'Could not activate the user at this time. Please try again later.' });
              })
          }
          else {
            res.status(401).send({ msg: 'You are not authorized for this operation' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not activate the user at this time. Please try again later.' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not activate the user at this time. Please try again later.' });
      })
  }
  else {
    res.status(406).send({ msg: 'Invalid data sent' });
  }
};

exports.deactivate = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.users.findOne({
      where: {
        id: req.body.id
      }
    })
      .then(user => {
        if (user) {
          if (utils.isAllowed(req.user, actions.DEACTIVATE_USER, user)) {
            if (req.user.id !== user.id) {
              user.status = 'inactive';
              return user.save()
                .then(response => {
                  res.sendStatus(200);
                })
                .catch(err => {
                  res.status(503).send({ msg: 'Could not deactivate the user at this time. Please try again later.' });
                })
            }
            else {
              res.status(403).send({ msg: 'You cannot deactivate your own user. Please contact support if you wish to delete your user' });
            }

          }
          else {
            res.status(401).send({ msg: 'You are not authorized for this operation' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not deactivate the user at this time. Please try again later.' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not deactivate the user at this time. Please try again later.' });
      })
  }
  else {
    res.status(406).send({ msg: 'Invalid data sent' });
  }
};