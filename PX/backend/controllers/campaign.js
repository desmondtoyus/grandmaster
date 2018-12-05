const utils = require('../utils');
const models = require('../models');
const moment = require('moment');
const actions = require('../utils/actions');
const validators = require('../utils/validators');
const shortid = require('shortid');
const roles = require('../utils/roles');

// Create campaign
exports.create = function (req, res, next) {
  // console.log(req.body)
  if (validators.campaign(req.body, 'create')) {
    if (utils.isAllowed(req.user, actions.CREATE_CAMPAIGN, null)) {
      const findAdv = async () => {
        return await models.advertisers.findOne({ where: { id: req.body.advertiserId } });
      };
      findAdv().then(adv => {
        models.campaigns.findOne({
          where: {
            name: req.body.name,
            advertiser_id: req.body.advertiserId
          }
        })
          .then(campaign => {
            if (!campaign) {
              const campaign = {
                created_at: moment().utc().unix(),
                name: req.body.name,
                notes: req.body.notes,
                start_time: req.body.startTime,
                end_time: req.body.endTime,
                status: 'active',
                day_impression_goal: req.body.dayImpressionGoal,
                total_impression_goal: req.body.totalImpressionGoal,
                zone_id: req.user.scope_zone_id,
                account_id: adv.account_id,
                advertiser_id: req.body.advertiserId,
                timezone: req.user.timezone
              };
              return models.campaigns.create(campaign)
                .then(campaign => {
                  res.sendStatus(200);
                })
                .catch(err => {
                  res.status(503).send({ msg: 'We could not create the campaign at this time. Please try again later' });
                })
            }
            else {
              res.status(422).send({ msg: 'Campaign with this name already exists. Please choose a different name' });
            }
          })
          .catch(err => {
            res.status(503).send({ msg: 'We could not create the campaign at this time. Please try again later' });
          })
      })
        .catch(err => {
          res.status(503).send({ msg: 'We could not create the campaign at this time. Please try again later' });
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



// Delete campaign
exports.delete = function(req, res, next) {
  if (validators.id(req.body.id)) {
    models.campaigns.findOne({
      where: {
        id: req.body.id
      },
      include: [
        {
          model: models.flights
        }
      ]
    })
      .then(campaign => {
        if (campaign) {
          if (utils.isAllowed(req.user, actions.DELETE_CAMPAIGN, campaign)) {
            if (!utils.activeItems(campaign.flights)) {
              campaign.status = 'disabled';
              campaign.name = `${campaign.name} - ${shortid.generate()}`;
              return campaign.save()
                .then(response => {
                  res.sendStatus(200);
                })
                .catch(err => {
                  res.status(503).send({ message: 'Could not delete the campaign at this time. Please try again later' });
                })
            }
            else {
              res.status(403).send({ msg: 'Campaign has flights. Please delete all the flights prior to deleting the campaign.'});
            }
          }
          else {
            res.status(401).send({ msg: 'You are not permitted to do this operation' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not delete the campaign at this time. Please try again later' });
        }
      })
      .catch(err => {
        res.status(503).send({ message: 'Could not delete the campaign at this time. Please try again later' });
      })
  }
  else {
    res.status(406).send({ message: 'Could not delete the campaign at this time. Please try again later' });
  }
};

// List active campaigns
exports.listActive = function(req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_CAMPAIGNS, null)) {
    let options = utils.generateOptions(req.body, 'campaigns');
    options.where.status = 'active';
    options.where.zone_id = req.user.scope_zone_id;
    console.log('BACKEND MASTER', req.body.master)
    if ((!(req.user.role & roles.SUPER_ADMIN) && !(req.user.role & roles.OPS_ADMIN)) || !req.body.master) {
      options.where.account_id = req.user.scope_account_id;
    }
    if (validators.id(req.body.id)) {
      options.where.advertiser_id = req.body.id;
    }
    options.attributes = ['id', 'name', 'created_at', 'start_time', 'end_time', 'status'];
    options.include = [
      {
        model: models.flights,
        attributes: ['id'],
        required: false,
        where: {
          status: {
            $or: ['active', 'inactive', 'complete', 'capped', 'complete', 'paused']
          }
        }
      },
      {
        model: models.advertisers,
        required: true,
        attributes: ['id', 'name']
      }
    ];

    models.campaigns.count({
      where: options.where
    })
      .then(count => {
        return models.campaigns.findAll(options)
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
            res.status(503).send({ message: "Could not display campaigns at this time. Please try again later."});
          })
      })
      .catch(err => {
        res.status(503).send({ message: "Could not display campaigns at this time. Please try again later."});
      })
  }
  else {
    res.sendStatus(401);
  }
};

// List inactive campaigns
exports.listInactive = function(req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_CAMPAIGNS, null)) {
    let options = utils.generateOptions(req.body, 'campaigns');
    options.where.status = {
      $or: ['inactive', 'complete']
    };
    options.where.zone_id = req.user.scope_zone_id;
    console.log('BACKEND MASTER', req.body.master)
    if ((!(req.user.role & roles.SUPER_ADMIN) && !(req.user.role & roles.OPS_ADMIN)) || !req.body.master) {
      options.where.account_id = req.user.scope_account_id;
    }
    if (validators.id(req.body.id)) {
      options.where.advertiser_id = req.body.id;
    }
    options.attributes = ['id', 'name', 'created_at', 'start_time', 'end_time', 'status'];
    options.include = [
      {
        model: models.flights,
        attributes: ['id'],
        required: false,
        where: {
          status: {
            $or: ['active', 'inactive', 'complete', 'capped', 'complete', 'paused']
          }
        }
      },
      {
        model: models.advertisers,
        attributes: ['id', 'name'],
        required: true
      }
    ];

    models.campaigns.count({
      where: options.where
    })
      .then(count => {
        return models.campaigns.findAll(options)
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
            res.status(503).send({ message: "Could not display campaigns at this time. Please try again later."});
          })
      })
      .catch(err => {
        res.status(503).send({ message: "Could not display campaigns at this time. Please try again later."});
      })
  }
  else {
    res.sendStatus(401);
  }
};

// List disabled campaigns
exports.listDisabled = function(req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_DISABLED_CAMPAIGNS, null)) {
    let options = utils.generateOptions(req.body, 'campaigns');
    options.where.status = 'disabled';
    options.where.zone_id = req.user.scope_zone_id;
    console.log('BACKEND MASTER', req.body.master)
    if ((!(req.user.role & roles.SUPER_ADMIN) && !(req.user.role & roles.OPS_ADMIN)) || !req.body.master) {
      options.where.account_id = req.user.scope_account_id;
    }
    if (validators.id(req.body.id)) {
      options.where.advertiser_id = req.body.id;
    }
    options.attributes = ['id', 'name', 'created_at', 'start_time', 'end_time', 'status'];
    options.include = [
      {
        model: models.flights,
        attributes: ['id']
      },
      {
        model: models.advertisers,
        attributes: ['id', 'name'],
        required: true
      }
    ];

    models.campaigns.count({
      where: options.where
    })
      .then(count => {
        return models.campaigns.findAll(options)
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
            res.status(503).send({ message: "Could not display campaigns at this time. Please try again later."});
          })
      })
      .catch(err => {
        res.status(503).send({ message: "Could not display campaigns at this time. Please try again later."});
      })
  }
  else {
    res.sendStatus(401);
  }
};

// List all campaigns except disabled
exports.list = function(req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_CAMPAIGNS, null)) {
    let options = utils.generateOptions(req.body, 'campaigns');
    options.where.status = {
      $or: ['active', 'inactive', 'complete']
    };
    options.where.zone_id = req.user.scope_zone_id;
    console.log('BACKEND MASTER', req.body.master)
    if (!req.body.master) {
      options.where.account_id = req.user.scope_account_id;
    }
    if (validators.id(req.body.id)) {
      options.where.advertiser_id = req.body.id;
    }
    options.attributes = ['id', 'name', 'created_at', 'start_time', 'end_time', 'status'];
    options.include = [
      {
        model: models.flights,
        attributes: ['id'],
        required: false,
        where: {
          status: {
            $or: ['active', 'inactive', 'complete', 'capped', 'complete', 'paused']
          }
        }
      },
      {
        model: models.advertisers,
        attributes: ['id', 'name'],
        required: true
      }
    ];

    models.campaigns.count({
      where: options.where
    })
      .then(count => {
        return models.campaigns.findAll(options)
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
            // console.log(err);
            res.status(503).send({ message: "Could not display campaigns at this time. Please try again later."});
          })
      })
      .catch(err => {
        res.status(503).send({ message: "Could not display campaigns at this time. Please try again later."});
      })
  }
  else {
    res.sendStatus(401);
  }
};

// Read a single campaign
exports.read = function(req, res, next) {
  if (validators.id(req.body.id)) {
    models.campaigns.findOne({
      where: {
        id: req.body.id
      },
      attributes: ['id', 'name', 'notes', 'start_time', 'end_time', 'status', 'day_impression_goal', 'total_impression_goal', 'timezone'],
      include: [
        {
          model: models.advertisers,
          attributes: ['id', 'name']
        }
      ]
    })
      .then(campaign => {
        if (campaign) {
          if (utils.isAllowed(req.user, actions.READ_CAMPAIGN, campaign)) {
            res.send({ campaign, timezone: req.user.timezone });
          }
          else {
            res.status(401).send({ msg: 'You are not authorized' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not retrieve the campaign at this time. Please try again later' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: "Could not retrieve the campaign at this time. Please try again later" });
      })
  }
  else {
    res.status(406).send({ msg: 'Your input is invalid' });
  }
};
//Start
exports.date = function (req, res, next) {
 
    models.campaigns.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(campaign => {
        if (campaign) {
          if (utils.isAllowed(req.user, actions.READ_CAMPAIGN, campaign)) {
            res.json(campaign);
          }
          else {
            res.status(401).send({ msg: 'You are not authorized' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not retrieve the campaign at this time. Please try again later' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: "Could not retrieve the campaign at this time. Please try again later" });
      })
  }
 


//End
// Update a campaign
exports.update = function(req, res, next) {
  if (validators.campaign(req.body, 'update')) {
    models.campaigns.findOne({
      where: {
        id: req.body.id
      }
    })
      .then(campaign => {
        if (campaign) {
          if (utils.isAllowed(req.user, actions.UPDATE_CAMPAIGN, campaign)) {
            campaign.name = req.body.name;
            campaign.notes = req.body.notes;
            campaign.start_time = req.body.startTime;
            campaign.end_time = req.body.endTime;
            campaign.day_impression_goal = req.body.dayImpressionGoal;
            campaign.total_impression_goal = req.body.totalImpressionGoal;
            campaign.timezone = req.user.timezone;
            campaign.status = req.body.status;
            return campaign.save()
              .then(response => {
                res.sendStatus(200);
              })
              .catch(err => {
                res.status(503).send({ msg: 'Could not update the campaign at this time. Please try again later.' });
              })
          }
          else {
            res.status(401).send({ msg: 'Your are not authorized to perform this operation' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not update the campaign at this time. Please try again later.' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not update the campaign at this time. Please try again later.' });
      })
  }
  else {
    res.status(406).send({ msg: 'Your input is invalid' });
  }
};

// List campaigns for a certain advertiser and formatted for a dropdown component
exports.listAdvertiserCampaigns = function(req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_CAMPAIGNS, null)) {
    models.campaigns.findAll({
      where: {
        advertiser_id: req.body.id,
        status: {
          $or: ['active', 'inactive', 'complete']
        }
      }
    })
      .then(results => {
        let payload = [];
        results.forEach(item => {
          payload.push({
            text: item.name,
            value: item.id
          })
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




// List advertisers for campaign creation formatted for a dropdown component
exports.listAdvertisers = function(req, res, next) {
  // console.log('PARAMS', req.params)
  let obj;
  // if ((req.user.role & roles.SUPER_ADMIN) || (req.user.role & roles.OPS_ADMIN)) {
  //   obj = { status: 'active' }

  // }
  // (req.params.master == 'true' || (req.user.role & roles.SUPER_ADMIN) || (req.user.role & roles.OPS_ADMIN))
  if (req.params.master == 'true') {
 obj = {
    zone_id: req.user.scope_zone_id,
      status: 'active'
  }
} else {
    obj =   {
      account_id: req.user.scope_account_id,
        status: 'active'
    }
}

  if (utils.isAllowed(req.user, actions.CREATE_CAMPAIGN, null)) {
    const payload=[];
    models.advertisers.findAll({
      where: obj
    })
      .then(results => {
        
        results.forEach(item => {
          payload.push({
            text: item.name,
            value: item.id
          })
        });
        res.send(payload);
      })
      .catch(err => {
        res.status(503).send({ message: "Could not create a campaign at this time. Please try again later."});
      })
  }
  else {
    res.status(401).send({ message: "Could not create a campaign at this time. Please try again later."});
  }
};

// Activate campaign
exports.activate = function(req, res, next) {
  if (validators.id(req.body.id)) {
    models.campaigns.findOne({
      where: {
        id: req.body.id
      }
    })
      .then(campaign => {
        if (campaign) {
          if (utils.isAllowed(req.user, actions.ACTIVATE_CAMPAIGN, campaign)) {
            campaign.status = 'active';
            return campaign.save()
              .then(response => {
                res.sendStatus(200);
              })
              .catch(err => {
                res.status(503).send({ msg: 'Could not activate the campaign at this time. Please try again later' });
              })
          }
          else {
            res.status(401).send({ msg: 'You are not permitted to do this operation' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not activate the campaign at this time. Please try again later' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not activate the campaign at this time. Please try again later' });
      })
  }
  else {
    res.status(406).send({ msg: 'Could not activate the campaign at this time. Please try again later' });
  }
};

// Deactivate campaign
exports.deactivate = function(req, res, next) {
  if (validators.id(req.body.id)) {
    models.campaigns.findOne({
      where: {
        id: req.body.id
      },
      include: [
        {
          model: models.flights
        }
      ]
    })
      .then(campaign => {
        if (campaign) {
          if (utils.isAllowed(req.user, actions.DEACTIVATE_CAMPAIGN, campaign)) {
            campaign.status = 'inactive';
            return campaign.save()
              .then(response => {
                res.sendStatus(200);
              })
              .catch(err => {
                res.status(503).send({ msg: 'Could not deactivate the campaign at this time. Please try again later' });
              })
          }
          else {
            res.status(401).send({ msg: 'You are not permitted to do this operation' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not deactivate the campaign at this time. Please try again later' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not deactivate the campaign at this time. Please try again later' });
      })
  }
  else {
    res.status(406).send({ msg: 'Could not deactivate the campaign at this time. Please try again later' });
  }
};

exports.tag = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.campaigns.findOne({
      where: {
        id: req.body.id
      }
    })
      .then(campaign => {
        if (campaign) {
          if (utils.isAllowed(req.user, actions.UPDATE_CAMPAIGN, campaign)) {
            res.send({id:campaign.id, account_id:campaign.account_id, advertiser_id:campaign.advertiser_id, campaign_id:campaign.id, zone_id:campaign.zone_id, isCampaign:true})
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