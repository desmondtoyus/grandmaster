const utils = require('../utils');
const models = require('../models');
const moment = require('moment');
const actions = require('../utils/actions');
const validators = require('../utils/validators');
const shortid = require('shortid');
const roles = require('../utils/roles');

// Create advertiser
exports.create = function(req, res, next) {
  if (validators.advertiser(req.body, 'create')) {
    if (utils.isAllowed(req.user, actions.CREATE_ADVERTISER, null)) {
      models.advertisers.findOne({
        where: {
          name: req.body.name,
          account_id: req.user.scope_account_id
        }
      })
        .then(advertiser => {
          if (!advertiser) {
            const advertiser = {
              created_at: moment().utc().unix(),
              name: req.body.name,
              notes: req.body.notes,
              status: 'active',
              zone_id: req.user.scope_zone_id,
              account_id: (req.body.account_id) ? (req.body.account_id) : (req.user.scope_account_id)
            };
            return models.advertisers.create(advertiser)
              .then(advertiser => {
                res.sendStatus(200);
              })
              .catch(err => {
                res.status(503).send({ msg: 'Could not create the advertiser at this time. Please try again later' });
              })
          }
          else {
            res.status(422).send({ msg: 'Advertiser with this name already exists. Please choose a different name' });
          }
        })
        .catch(err => {
          res.status(503).send({ msg: 'Could not create the advertiser at this time. Please try again later' });
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


// options.where.account_id = req.user.scope_account_id;
// if (validators.id(req.body.id)) {
//   options.where.advertiser_id = req.body.id;
// }


// List all advertisers except disabled
exports.list = function(req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_ADVERTISERS, null)) {
    let options = utils.generateOptions(req.body, 'advertisers');
    options.where.status = 'active';
    options.where.zone_id = req.user.scope_zone_id;
    console.log('BACKEND MASTER', req.body.master)
    if ((!(req.user.role & roles.SUPER_ADMIN) && !(req.user.role & roles.OPS_ADMIN)) || !req.body.master) {
      options.where.account_id = req.user.scope_account_id;
    }

    options.include = [
      {
        model: models.campaigns,
        required: false,
        attributes: ['id'],
        where: {
          status: {
            $or: ['active', 'inactive', 'complete']
          }
        }
      }
    ];
    options.attributes = ['id', 'created_at', 'name', 'status'];

    models.advertisers.count({
      where: options.where
    })
      .then(count => {
        return models.advertisers.findAll(options)
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
            res.status(503).send({ msg: "Could not display publishers at this time. Please try again later."});
          })
      })
      .catch(err => {
        res.status(503).send({ msg: "Could not display publishers at this time. Please try again later."});
      })
  }
  else {
    res.sendStatus(401);
  }
};

// List disabled advertisers
exports.listDisabled = function(req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_DISABLED_ADVERTISERS, null)) {
    let options = utils.generateOptions(req.body, 'advertisers');
    options.where.status = 'disabled';
    options.where.zone_id = req.user.scope_zone_id;
    console.log('BACKEND MASTER', req.body.master)
    if ((!(req.user.role & roles.SUPER_ADMIN) && !(req.user.role & roles.OPS_ADMIN)) || !req.body.master) {
      options.where.account_id = req.user.scope_account_id;
    }
    options.include = [
      {
        model: models.campaigns,
        attributes: ['id']
      }
    ];
    options.attributes = ['id', 'created_at', 'name', 'status'];

    models.advertisers.count({
      where: options.where
    })
      .then(count => {
        return models.advertisers.findAll(options)
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
            res.status(503).send({ msg: "Could not display publishers at this time. Please try again later."});
          })
      })
      .catch(err => {
        res.status(503).send({ msg: "Could not display publishers at this time. Please try again later."});
      })
  }
  else {
    res.sendStatus(401);
  }
};

// Read an advertiser
exports.read = function(req, res, next) {
  if (validators.id(req.body.id)) {
    models.advertisers.findOne({
      where: {
        id: req.body.id
      },
      attributes: ['id', 'name', 'notes', 'status', 'account_id']
    })
      .then(advertiser => {
        if (advertiser) {
          if (utils.isAllowed(req.user, actions.READ_ADVERTISER, advertiser)) {
            res.send(advertiser);
          }
          else {
            res.status(401).send({ msg: 'You are not authorized' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not retrieve the advertiser at this time. Please try again later' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: "Could not retrieve the advertiser at this time. Please try again later" });
      })
  }
  else {
    res.status(406).send({ msg: 'Your input is invalid' });
  }
};

// Update an advertiser
exports.update = function(req, res, next) {
  if (validators.advertiser(req.body, "update")) {
    models.advertisers.findOne({ where: { id: req.body.id }})
      .then(advertiser => {
        if (advertiser) {
          if (utils.isAllowed(req.user, actions.UPDATE_ADVERTISER, advertiser)) {
            advertiser.name = req.body.name;
            advertiser.notes = req.body.notes;
            advertiser.account_id = (req.body.account_id) ? (req.body.account_id) : (req.user.scope_account_id)
            return advertiser.save()
              .then(response => {
                res.sendStatus(200);
              })
              .catch(err => {
                res.status(503).send({ msg: 'Could not update the advertiser at this time. Please try again later.' });
              })
          }
          else {
            res.status(401).send({ msg: 'Your are not authorized to perform this operation' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not update the advertiser at this time. Please try again later.' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not update the advertiser at this time. Please try again later.' });
      })
  }
  else {
    res.status(406).send({ msg: 'Your input is invalid' });
  }
};

// Delete an advertiser
exports.delete = function(req, res, next) {
  if (validators.id(req.body.id)) {
    models.advertisers.findOne({
      where: {
        id: req.body.id
      },
      include: [
        {
          model: models.campaigns
        }
      ]
    })
      .then(advertiser => {
        if (advertiser) {
          if (utils.isAllowed(req.user, actions.DELETE_ADVERTISER, advertiser)) {
            if (!utils.activeItems(advertiser.campaigns)) {
              advertiser.status = 'disabled';
              advertiser.name = `${advertiser.name} - ${shortid.generate()}`;
              return advertiser.save()
                .then(response => {
                  res.sendStatus(200);
                })
                .catch(err => {
                  res.status(503).send({ msg: 'Could not delete the advertiser at this time. Please try again later'});
                })
            }
            else {
              res.status(403).send({ msg: 'Advertiser has campaigns. Please delete all the campaigns prior to deleting the advertiser.'});
            }
          }
          else {
            res.status(401).send({ msg: 'You are not permitted to do this operation' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not delete the advertiser at this time. Please try again later' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not delete the advertiser at this time. Please try again later' });
      })
  }
  else {
    res.status(406).send({ msg: 'Could not delete the advertiser at this time. Please try again later' });
  }
};

// List advertisers for dropdowns in the UI
exports.listAll = function(req, res, next) {
   if (utils.isAllowed(req.user, actions.LIST_ADVERTISERS, null)) {
    models.advertisers.findAll({ where: { account_id: req.user.scope_account_id, status: 'active' }})
      .then(results => {
        let payload = [];
        results.forEach(item => {
          payload.push({
            text: item.name,
            value: item.id
          });
        });
        res.send(payload);
      })
      .catch(err => {
        res.sendStatus(503);
      })
  }
  else {
    res.sendStatus(401);
  }
};