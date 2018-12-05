const utils = require('../utils');
const models = require('../models');
const moment = require('moment');
const actions = require('../utils/actions');
const validators = require('../utils/validators');
const shortid = require('shortid');
const roles = require('../utils/roles');

exports.create = function(req, res, next) {
  if (validators.publisher(req.body, 'create')) {
    if (utils.isAllowed(req.user, actions.CREATE_PUBLISHER, null)) {
      models.publishers.findOne({
        where: {
          name: req.body.name,
          zone_id: req.user.scope_zone_id
        }
      })
        .then(publisher => {
          if (!publisher) {
            const publisher = {
              created_at: moment().utc().unix(),
              name: req.body.name,
              iab_categories: req.body.iabCategory,
              notes: req.body.notes,
              status: 'active',
              zone_id: req.user.scope_zone_id,
              account_id: (req.body.account_id) ? (req.body.account_id) : (req.user.scope_account_id)
              // req.user.
            };
            return models.publishers.create(publisher)
              .then(publisher => {
                res.sendStatus(200);
              })
              .catch(err => {
                res.status(503).send({ msg: 'We could not create the publisher at this time. Please try again later' });
              })
          }
          else {
            res.status(422).send({ msg: 'Publisher with this name already exists. Please choose a different name' });
          }
        })
        .catch(err => {
          res.status(503).send({ msg: 'We could not create the publisher at this time. Please try again later' });
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

exports.list = function(req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_PUBLISHERS, null)) {
    let options = utils.generateOptions(req.body, 'publishers');
    options.where.status = 'active';
    options.where.zone_id = req.user.scope_zone_id;
    console.log('BACKEND MASTER', req.body.master)
    if ((!(req.user.role & roles.SUPER_ADMIN) && !(req.user.role & roles.OPS_ADMIN)) || !req.body.master) {
      options.where.account_id = req.user.scope_account_id;
    }
    options.include = [
      {
        model: models.placements,
        require: false,
        attributes: ['id'],
        // where: {
        //   status: {
        //     $or: ['active', 'inactive', 'complete']
        //   }
        // }
      }
    ];
    options.attributes = ['id', 'created_at', 'name', 'status'];

    models.publishers.count({
      where: options.where
    })
      .then(count => {
        return models.publishers.findAll(options)
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
            res.status(503).send({ message: "Could not display publishers at this time. Please try again later."});
          })
      })
      .catch(err => {
        res.status(503).send({ message: "Could not display publishers at this time. Please try again later."});
      })
  }
  else {
    res.sendStatus(401);
  }
};

exports.listDisabled = function(req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_DISABLED_PUBLISHERS, null)) {
    let options = utils.generateOptions(req.body, 'publishers');
    options.where.status = 'disabled';

    options.where.zone_id = req.user.scope_zone_id;
    console.log('BACKEND MASTER', req.body.master)
    if ((!(req.user.role & roles.SUPER_ADMIN) && !(req.user.role & roles.OPS_ADMIN)) || !req.body.master) {
      options.where.account_id = req.user.scope_account_id;
    }
    options.attributes = ['id', 'created_at', 'name', 'status'];
    options.include = [
      {
        model: models.placements,
        attributes: ['id']
      }
    ];

    models.publishers.count({
      where: options.where
    })
      .then(count => {
        return models.publishers.findAll(options)
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
            res.status(503).send({ message: "Could not display publishers at this time. Please try again later." });
          })
      })
      .catch(err => {
        res.status(503).send({ message: "Could not display publishers at this time. Please try again later." });
      })
  }
  else {
    res.sendStatus(401);
  }
};



exports.read = function(req, res, next) {
  if (validators.id(req.body.id)) {
    models.publishers.findOne({
      where: {
        id: req.body.id
      },
      attributes: ['id', 'name', 'iab_categories', 'notes', 'status', 'account_id']
    })
      .then(publisher => {
        if (publisher) {
          if (utils.isAllowed(req.user, actions.READ_PUBLISHER, publisher)) {
            res.send(publisher);
          }
          else {
            res.status(401).send({ msg: 'You are not authorized' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not retrieve the publisher at this time. Please try again later' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: "Could not retrieve the publisher at this time. Please try again later" });
      })
  }
  else {
    res.status(406).send({ msg: 'Your input is invalid' });
  }
};

exports.delete = function(req, res, next) {
  if (validators.id(req.body.id)) {
    models.publishers.findOne({
      where: {
        id: req.body.id
      },
      include: [
        {
          model: models.placements
        }
      ]
    })
      .then(publisher => {
        if (publisher) {
          if (utils.isAllowed(req.user, actions.DELETE_PUBLISHER, publisher)) {
            if (!utils.activeItems(publisher.placements)) {
              publisher.status = 'disabled';
              publisher.name = `${publisher.name} - ${shortid.generate()}`;
              return publisher.save()
                .then(response => {
                  res.sendStatus(200);
                })
                .catch(err => {
                  res.status(503).send({ message: 'Could not delete the publisher at this time. Please try again later'});
                })
            }
            else {
              res.status(403).send({ message: 'Publisher has placements. Please delete all the placements prior to deleting the publisher.'});
            }
          }
          else {
            res.status(401).send({ msg: 'You are not permitted to do this operation' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not delete the publisher at this time. Please try again later' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not delete the publisher at this time. Please try again later' });
      })
  }
  else {
    res.status(406).send({ msg: 'Could not delete the publisher at this time. Please try again later' });
  }
};

exports.update = function(req, res, next) {
  if (validators.publisher(req.body, "update")) {
    models.publishers.findOne({ where: { id: req.body.id }})
      .then(publisher => {
        if (publisher) {
          if (utils.isAllowed(req.user, actions.UPDATE_PUBLISHER, publisher)) {
            publisher.name = req.body.name;
            publisher.iab_categories = req.body.iabCategory;
            publisher.notes = req.body.notes;
            publisher.account_id = (req.body.account_id) ? (req.body.account_id) : (req.user.scope_account_id)
            // account_id: (req.body.account_id) ? (req.body.account_id) : (req.user.scope_account_id)
            return publisher.save()
              .then(response => {
                res.sendStatus(200);
              })
              .catch(err => {
                res.status(503).send({ msg: 'Could not update the publisher at this time. Please try again later.' });
              })
          }
          else {
            res.status(401).send({ msg: 'Your are not authorized to perform this operation' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not update the publisher at this time. Please try again later.' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not update the publisher at this time. Please try again later.' });
      })
  }
  else {
    res.status(406).send({ msg: 'Your input is invalid' });
  }
};

exports.listAll = function(req, res, next) {
  console.log('backend dropdown is master?', req.params.master)
  let obj;

  if ((req.user.role & roles.SUPER_ADMIN) || (req.user.role & roles.OPS_ADMIN)) {
    obj = { status: 'active' }
  }

  if (req.params.master=='true') {
   obj = { where: { zone_id: req.user.scope_zone_id, status: 'active' } }
  }
  else
  {
    obj = { where: { account_id: req.user.scope_account_id, status: 'active' } }
  }
  if (utils.isAllowed(req.user, actions.LIST_PUBLISHERS, null)) {
    models.publishers.findAll(obj)
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