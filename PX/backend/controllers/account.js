const models = require('../models');
const utils = require('../utils');
const moment = require('moment');
const actions = require('../utils/actions');
const roles = require('../utils/roles');
const validators = require('../utils/validators');

// Listing all accounts which are active or inactive
exports.list = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_ACCOUNTS, null)) {
    let options = utils.generateOptions(req.body, 'accounts');
    options.where.status = {
      $or: ['active', 'inactive']
    };

    console.log('BACKEND MASTER', req.body.master)
    if ((!(req.user.role & roles.SUPER_ADMIN) && !(req.user.role & roles.OPS_ADMIN)) || !req.body.master) {
      options.where.id = req.user.scope_account_id;
    }
    if (((req.user.role & roles.SUPER_ADMIN) || (req.user.role & roles.OPS_ADMIN)) && req.body.master) {
      options.where.zone_id = req.user.scope_zone_id;
    }


    options.attributes = ['id', 'created_at', 'name', 'zone_id', 'status', 'is_zone_master'];
    options.include = [
      {
        model: models.users,
        attributes: ['id']
      }
    ];

    models.accounts.count({
      where: options.where
    })
      .then(count => {
        return models.accounts.findAll(options)
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
            res.status(503).send({ msg: "Could not display accounts at this time. Please try again later." });
          })
      })
      .catch(err => {
        res.status(503).send({ msg: "Could not display accounts at this time. Please try again later." });
      })
  }
  else {
    res.sendStatus(401);
  }
};

// LIST MASTER ACCOUNT
exports.master_list = function (req, res, next) {
  //do an if to check if the user is a zone master
  let options = {
    where: {},
    order: [
      ['id', 'asc']
    ],
  };
  options.where.status = {
    $or: ['active']
  };
  if (!req.body.master) {
      options.where.id = req.user.scope_account_id;
  }
  else {
    options.where.zone_id = req.user.scope_zone_id;
  }

  options.attributes = ['id', 'name'];
  options.include = [
    {
      model: models.users,
      attributes: ['id']
    }
  ];

  models.accounts.count({
    where: options.where
  })
    .then(count => {
      return models.accounts.findAll(options)
        .then(results => {
          console.log("PAYLOAD", results.length);
          let payload = {};
          payload.rows = results;
          payload.pagination = {
            currentPage: 1,
            limit: 1000,
            totalPages: 1
          };

          res.json(payload);
        })
        .catch(err => {
          res.status(503).send({ msg: "Could not display accounts at this time. Please try again later." });
        })
    })
    .catch(err => {
      res.status(503).send({ msg: "Could not display accounts at this time. Please try again later." });
    })

};

// Listing all pending accounts
exports.listPending = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_PENDING_ACCOUNTS, null)) {
    let options = utils.generateOptions(req.body, 'accounts');
    options.where.status = 'pending';
    console.log('BACKEND MASTER', req.body.master)
    if ((!(req.user.role & roles.SUPER_ADMIN) && !(req.user.role & roles.OPS_ADMIN)) || !req.body.master) {
      options.where.id = req.user.scope_account_id;
    }
    if ((!(req.user.role & roles.SUPER_ADMIN) && !(req.user.role & roles.OPS_ADMIN)) && req.body.master) {
      options.where.zone_id = req.user.zone_id;
    }
    options.attributes = ['id', 'created_at', 'name', 'zone_id', 'status', 'is_zone_master'];
    options.include = [
      {
        model: models.users,
        attributes: ['id']
      }
    ];

    models.accounts.count({
      where: options.where
    })
      .then(count => {
        return models.accounts.findAll(options)
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
            res.status(503).send({ message: "Could not display accounts at this time. Please try again later." });
          })
      })
      .catch(err => {
        res.status(503).send({ message: "Could not display accounts at this time. Please try again later." });
      })
  }
  else {
    res.sendStatus(401);
  }
};

// Listing all disabled accounts
exports.listDisabled = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_DISABLED_ACCOUNTS, null)) {
    let options = utils.generateOptions(req.body, 'accounts');
    options.where.status = 'disabled';
    console.log('BACKEND MASTER', req.body.master)
    if ((!(req.user.role & roles.SUPER_ADMIN) && !(req.user.role & roles.OPS_ADMIN)) || !req.body.master) {
      options.where.id = req.user.scope_account_id;
    }
    if ((!(req.user.role & roles.SUPER_ADMIN) && !(req.user.role & roles.OPS_ADMIN)) && req.body.master) {
      options.where.zone_id = req.user.zone_id;
    }
    options.attributes = ['id', 'created_at', 'name', 'zone_id', 'status', 'is_zone_master'];
    options.include = [
      {
        model: models.users,
        attributes: ['id']
      }
    ];

    models.accounts.count({
      where: options.where
    })
      .then(count => {
        return models.accounts.findAll(options)
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
            res.status(503).send({ message: "Could not display accounts at this time. Please try again later." });
          })
      })
      .catch(err => {
        res.status(503).send({ message: "Could not display accounts at this time. Please try again later." });
      })
  }
  else {
    res.sendStatus(401);
  }
};

// List all accounts available for account selection
exports.scopeList = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_ACCOUNTS, null)) {
    let options = utils.generateOptions(req.body, 'accounts');
    options.where.status = 'active';

    if (!(req.user.role & roles.SUPER_ADMIN) && !(req.user.role & roles.OPS_ADMIN)) {
      options.where.zone_id = req.user.zone_id;
    }
    options.attributes = ['id', 'created_at', 'name', 'zone_id'];

    models.accounts.count({
      where: options.where
    })
      .then(count => {
        return models.accounts.findAll(options)
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
            res.status(503).send({ message: "Could not display accounts at this time. Please try again later." });
          })
      })
      .catch(err => {
        res.status(503).send({ message: "Could not display accounts at this time. Please try again later." });
      })
  }
  else {
    res.sendStatus(401);
  }
};

// Reading a single account
exports.read = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.accounts.findOne({ where: { id: req.body.id }, attributes: ['id', 'name', 'notes', 'zone_id', 'status'] })
      .then(account => {
        if (account) {
          if (utils.isAllowed(req.user, actions.READ_ACCOUNT, account)) {
            res.send(account);
          }
          else {
            res.status(401).send({ msg: 'You are not authorized' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not retrieve the account at this time. Please try again later' });
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

// Creating an account
exports.create = function (req, res, next) {
  if (validators.account(req.body, 'create')) {
    if (utils.isAllowed(req.user, actions.CREATE_ACCOUNT, null)) {
      const account = {
        created_at: moment().utc().unix(),
        is_zone_master: false,
        name: req.body.name,
        notes: req.body.notes,
        status: 'active',
        approved_at: moment().utc().unix(),
        zone_id: req.user.scope_zone_id
      };
      models.accounts.create(account)
        .then(account => {
          res.sendStatus(200);
        })
        .catch(err => {
          res.status(503).send({ msg: 'We could not create an account at this time. Please try again later' });
        })
    }
    else {
      res.status(401).send({ msg: 'Your are not authorized to perform this operation' });
    }
  }
  else {
    res.status(406).send({ msg: 'Your input is invalid' });
  }
};

// Disabled an account
exports.delete = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.accounts.findOne({
      where: {
        id: req.body.id
      },
      include: [
        {
          model: models.users
        }
      ]

    })
      .then(account => {
        if (account) {
          if (utils.isAllowed(req.user, actions.DELETE_ACCOUNT, account)) {
            if (!account.is_zone_master && !account.users.length) {
              account.status = 'disabled';
              account.save()
                .then(response => {
                  res.send();
                })
                .catch(err => {
                  res.status(503).send({ message: 'Could not delete the account at this time. Please try again later' });
                })
            }
            else if (account.is_zone_master) {
              res.status(403).send({ message: 'Cannot delete a primary account.' });
            }
            else if (account.users.length) {
              res.status(403).send({ message: 'Account has users. Please delete all the users prior to deleting the account.' });
            }
          }
          else {
            res.status(401).send({ msg: 'You are not permitted to do this operation' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not delete the account at this time. Please try again later' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not delete the account at this time. Please try again later' });
      })
  }
  else {
    res.status(406).send({ msg: 'Could not delete the account at this time. Please try again later' });
  }
};

// Update an account
exports.update = function (req, res, next) {
  if (validators.account(req.body, "update")) {
    models.accounts.findOne({ where: { id: req.body.id } })
      .then(account => {
        if (account) {
          if (utils.isAllowed(req.user, actions.UPDATE_ACCOUNT, account)) {
            account.name = req.body.name;
            account.notes = req.body.notes;
            return account.save()
              .then(response => {
                res.sendStatus(200);
              })
              .catch(err => {
                res.status(503).send({ msg: 'Could not update the account at this time. Please try again later.' });
              })
          }
          else {
            res.status(401).send({ msg: 'Your are not authorized to perform this operation' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not update the account at this time. Please try again later.' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not update the account at this time. Please try again later.' });
      })
  }
  else {
    res.status(406).send({ msg: 'Your input is invalid' });
  }
};

// Activate an account
exports.activate = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.accounts.findOne({
      where: {
        id: req.body.id
      }
    })
      .then(account => {
        if (account) {
          if (utils.isAllowed(req.user, actions.ACTIVATE_ACCOUNT, account)) {
            account.status = 'active';
            return account.save()
              .then(response => {
                res.sendStatus(200);
              })
              .catch(err => {
                res.status(503).send({ msg: 'Could not activate the account at this time. Please try again later.' });
              })
          }
          else {
            res.status(401).send({ msg: 'You are not authorized for this operation' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not activate the account at this time. Please try again later.' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not activate the account at this time. Please try again later.' });
      })
  }
  else {
    res.status(406).send({ msg: 'Invalid data sent' });
  }
};

// Deactivate account that contains active users
async function deactivateAccountWithUsers(account) {
  try {
    for (let i = 0; i < account.users.length; i++) {
      account.users[i].status = 'inactive';
      await account.users[i].save();
    }
    account.status = 'inactive';
    await account.save();

    return true;
  }
  catch (err) {
    return false;
  }
}

// Deactivate account
exports.deactivate = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.accounts.findOne({
      where: {
        id: req.body.id
      },
      include: [
        {
          model: models.users
        }
      ]
    })
      .then(account => {
        if (account) {
          if (utils.isAllowed(req.user, actions.DEACTIVATE_ACCOUNT, account)) {
            if (account.users.includes(req.user.id)) {
              res.status(406).send({ msg: 'You cannot deactivate your own account. If you would like to delete the account please contact support.' });
            }
            else if (account.is_zone_master) {
              res.status(406).send({ msg: 'You cannot deactivate a primay account. If you would like to delete the account please contact support' });
            }
            else if (account.users.length) {
              return deactivateAccountWithUsers(account)
                .then(response => {
                  if (response) {
                    res.sendStatus(200);
                  }
                  else {
                    res.status(503).send({ msg: 'Could not deactivate the account at this time. Please try again later.' });
                  }
                })
            }
            else {
              account.status = 'inactive';
              return account.save()
                .then(response => {
                  res.sendStatus(200);
                })
                .catch(err => {
                  res.status(503).send({ msg: 'Could not deactivate the account at this time. Please try again later.' });
                })
            }
          }
          else {
            res.status(401).send({ msg: 'You are not authorized for this operations' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not deactivate the account at this time. Please try again later.' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not deactivate the account at this time. Please try again later.' });
      })
  }
  else {
    res.status(406).send({ msg: 'Invalid data sent' })
  }
};
