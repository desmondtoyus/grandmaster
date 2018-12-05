const utils = require('../utils');
const models = require('../models');
const val = require('../utils/validators');
const moment = require('moment');
const actions = require('../utils/actions');
const validators = require('../utils/validators');
const roles = require('../utils/roles');
const shortid = require('shortid');

function createBrandSafety(createdPlacement, data) {
  let payload = [];
  data.forEach(item => {
    payload.push({
      name: item.name,
      is_active: item.isActive,
      placement_id: createdPlacement.id
    })
  });
  return models.placement_brand_safety_providers.bulkCreate(payload);
}

function createCaps(createdPlacement, data) {
  let payload = [];
  data.forEach(item => {
    payload.push({
      opportunities: item.opportunities,
      interval: item.interval,
      start_time: item.startTime ? moment(`${item.startTime} 00:00`).utc().unix() : 0,
      end_time: item.endTime ? moment(`${item.endTime} 23:59`).utc().unix() : 2147483647,
      placement_id: createdPlacement.id,
      status: 'active',
      current_opportunity_count: 0
    })
  });
  return models.placement_caps.bulkCreate(payload);
}

function createGeoTarget(createdPlacement, data) {
  let payload = [];

  data.forEach(item => {
    payload.push({
      is_include: item.is_include,
      country: item.type === 'country' ? item.value : '',
      province: item.type === 'province' ? item.value : '',
      city: item.type === 'city' ? item.value : '',
      dma: item.type === 'dma' ? item.value : '',
      postal_code: item.type === 'postal_code' ? item.value : '',
      placement_id: createdPlacement.id
    })
  });

  return models.placement_geo_targets.bulkCreate(payload);
}

async function createPlacement(placement, data) {
  try {
    const createdPlacement = await models.placements.create(placement);
    await createBrandSafety(createdPlacement, data.brandSafety);
    if (data.caps.length) {
      await createCaps(createdPlacement, data.caps);
    }
    await createGeoTarget(createdPlacement, data.targetGeo);
    return true;
  }
  catch (err) {
    console.log(err);
    return false;
  }
}

async function updatePlacement(placement, data) {
  try {
    await placement.save();
    // Updating Brand Safety
    let arr = data.brandSafety;
    arr.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    for (let i = 0; i < arr.length; i++) {
      placement.placement_brand_safety_providers[i].is_active = arr[i].isActive;
      await placement.placement_brand_safety_providers[i].save();
    }
    // Updating Caps
    let destroy = [true, true];
    for (let i = 0; i < data.caps.length; i++) {
      // Create a cap
      if (data.caps[i].id === 0) {
        await models.placement_caps.create({
          opportunities: data.caps[i].opportunities,
          interval: data.caps[i].interval,
          start_time: data.caps[i].startTime ? moment(`${data.caps[i].startTime} 00:00`).utc().unix() : 0,
          end_time: data.caps[i].endTime ? moment(`${data.caps[i].endTime} 23:59`).utc().unix() : 2147483647,
          status: 'active',
          placement_id: placement.id,
          current_opportunity_count: 0
        });
      }
      else {
        for (let j = 0; j < placement.placement_caps.length; j++) {
          if (data.caps[i].id === placement.placement_caps[j].id) {
            placement.placement_caps[j].opportunities = data.caps[i].opportunities;
            placement.placement_caps[j].interval = data.caps[i].interval;
            placement.placement_caps[j].start_time = data.caps[i].startTime ? moment(`${data.caps[i].startTime} 00:00`).utc().unix() : 0;
            placement.placement_caps[j].end_time = data.caps[i].endTime ? moment(`${data.caps[i].endTime} 23:59`).utc().unix() : 2147483647;
            if (data.caps[i].opportunities > placement.placement_caps[j].current_opportunity_count) {
              placement.placement_caps[j].status = 'active';
            }
            destroy[j] = false;
            await placement.placement_caps[j].save();
          }
        }
      }
    }
    for (let i = 0; i < placement.placement_caps.length; i++) {
      if (destroy[i]) {
        await placement.placement_caps[i].destroy();
      }
    }
    // Updating Geo Targeting
    destroy = [];
    let create = [];
    destroy.length = placement.placement_geo_targets.length;
    destroy.fill(true);
    create.length = data.targetGeo.length;
    create.fill(true);
    for (let i = 0; i < placement.placement_geo_targets.length; i++) {
      for (let j = 0; j < data.targetGeo.length; j++) {
        if (placement.placement_geo_targets[i][data.targetGeo[j].type] === data.targetGeo[j].value && placement.placement_geo_targets[i].is_include === data.targetGeo[j].is_include) {
          destroy[i] = false;
          create[j] = false;
        }
      }
    }
    // Create new geos
    for (let i = 0; i < data.targetGeo.length; i++) {
      if (create[i]) {
        await models.placement_geo_targets.create({
          is_include: data.targetGeo[i].is_include,
          country: data.targetGeo[i].type === 'country' ? data.targetGeo[i].value : '',
          province: data.targetGeo[i].type === 'province' ? data.targetGeo[i].value : '',
          city: data.targetGeo[i].type === 'city' ? data.targetGeo[i].value : '',
          dma: data.targetGeo[i].type === 'dma' ? data.targetGeo[i].value : '',
          postal_code: data.targetGeo[i].type === 'postal_code' ? data.targetGeo[i].value : '',
          placement_id: placement.id
        })
      }
    }
    // Delete geos
    for (let i = 0; i < placement.placement_geo_targets.length; i++) {
      if (destroy[i]) {
        await placement.placement_geo_targets[i].destroy();
      }
    }

    return true;
  }
  catch (err) {
    console.log(err);
    return false;
  }
}

exports.create = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.CREATE_PLACEMENT, null)) {
    if (validators.placement(req.body, 'create')) {
      models.publishers.findOne({ where: { id: req.body.publisherId } })
        .then(publisher => {
          if (publisher && utils.isAllowed(req.user, actions.UPDATE_PUBLISHER, publisher)) {
            return models.placements.findOne({
              where: {
                name: req.body.name,
                publisher_id: publisher.id
              }
            })
              .then(placement => {
                if (!placement) {
                  const placement = {
                    created_at: moment().utc().unix(),
                    name: req.body.name,
                    passback_url: req.body.passbackUrl,
                    notes: req.body.notes,
                    cpm: req.body.cpm,
                    cpc: req.body.cpc,
                    bwa_cpm: req.body.bwaCPM,
                    is_revshare: req.body.isRevshare,
                    publisher_revenue_share: req.body.revShare,
                    width: req.body.width,
                    height: req.body.height,
                    player_size: req.body.playerSize,
                    iab_categories: req.body.iabCategory,
                    demand_list: req.body.demandList,
                    optimizer: req.body.optimizer,
                    is_vast_only: req.body.isVastOnly,
                    has_bwa_video_player: req.body.isPilotPlayer,
                    bwa_video_player_volume: req.body.volume,
                    bwa_player_type: req.body.playerType,
                    // NB width and height is used instead of the player width
                    bwa_video_player_width: 0,
                    bwa_video_player_height: 0,
                    format: req.body.format,
                    max_video_duration: req.body.maxVideoDuration,
                    app_store_url: req.body.appStoreUrl,
                    channel: req.body.channel,
                    timezone: req.user.timezone,
                    zone_id: req.user.scope_zone_id,
                    // account_id: req.user.scope_account_id,
                    account_id: publisher.account_id,
                    publisher_id: publisher.id,
                    status: 'active',
                    domain_list_id: req.body.listId,
                    domain_list_category: req.body.listCategory,
                    pricing_model: req.body.pricingModel,
                    default_domain: req.body.defaultDomain,
                    default_app_name: req.body.defaultAppName,
                    default_bundle_id: req.body.defaultBundleId,
                    default_ctv_channel: req.body.defaultCtvChannel

                  };
                  return createPlacement(placement, req.body)
                    .then(response => {
                      if (response) {
                        res.sendStatus(200);
                      }
                      else {
                        res.status(503).send({ msg: 'Unable to create a placement at this time. Please try again later.' });
                      }
                    })
                }
                else {
                  res.status(422).send({ msg: 'Placement with this name already exists. Please choose a different name' });
                }
              })
              .catch(err => {
                res.status(503).send({ msg: 'Unable to create a placement at this time. Please try again later.' });
              })
          }
          else {
            res.status(401).send({ msg: 'You are not authorized for this operation' });
          }
        })
        .catch(err => {
          res.status(503).send({ msg: 'Unable to create a placement at this time. Please try again later.' });
        })
    }
    else {
      res.status(406).send({ msg: 'Unable to create a placement at this time. Please try again later.' });
    }
  }
  else {
    res.status(401).send({ msg: 'You are not authorized for this operation' });
  }
};

exports.delete = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.placements.findOne({ where: { id: req.body.id } })
      .then(placement => {
        if (placement) {
          if (utils.isAllowed(req.user, actions.DELETE_PLACEMENT, placement)) {
            placement.status = 'disabled';
            placement.name = `${placement.name} - deleted-${val.generateTime()}`
            return placement.save()
              .then(response => {
                res.sendStatus(200);
              })
              .catch(err => {
                res.status(503).send({ message: 'Could not delete the placement at this time. Please try again later' });
              })
          }
          else {
            res.status(401).send({ msg: 'You are not permitted to do this operation' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not delete the placement at this time. Please try again later' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not delete the placement at this time. Please try again later' });
      })
  }
  else {
    res.status(406).send({ msg: 'Could not delete the placement at this time. Please try again later' });
  }
};

exports.list = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_PLACEMENTS, null)) {
    let options = utils.generateOptions(req.body, 'placements');
    options.where.status = {
      $or: ['active', 'inactive', 'complete']
    };
    options.where.zone_id = req.user.scope_zone_id;
    console.log('BACKEND MASTER', req.body.master)
    if ((!(req.user.role & roles.SUPER_ADMIN) && !(req.user.role & roles.OPS_ADMIN)) || !req.body.master) {
      options.where.account_id = req.user.scope_account_id;
    }

    if (validators.id(req.body.id)) {
      options.where.publisher_id = req.body.id;
    }
    options.attributes = ['id', 'name', 'created_at', 'channel', 'format', 'width', 'height', 'cpm', 'status', 'player_size', 'iab_categories', 'demand_prioritization_type'];
    options.include = [
      {
        model: models.publishers,
        attributes: ['id', 'name'],
        required: true
      }
    ];

    models.placements.count({
      where: options.where
    })
      .then(count => {
        return models.placements.findAll(options)
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
            res.status(503).send({ message: "Could not display placements at this time. Please try again later." });
          })
      })
      .catch(err => {
        res.status(503).send({ message: "Could not display placements at this time. Please try again later." });
      })
  }
  else {
    res.sendStatus(401);
  }
};

exports.listActive = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_PLACEMENTS, null)) {
    let options = utils.generateOptions(req.body, 'placements');
    options.where.status = 'active';
    options.where.zone_id = req.user.scope_zone_id;
    console.log('BACKEND MASTER', req.body.master)
    if ((!(req.user.role & roles.SUPER_ADMIN) && !(req.user.role & roles.OPS_ADMIN)) || !req.body.master) {
      options.where.account_id = req.user.scope_account_id;
    }
    if (validators.id(req.body.id)) {
      options.where.publisher_id = req.body.id;
    }
    options.attributes = ['id', 'name', 'created_at', 'channel', 'format', 'width', 'height', 'cpm', 'status', 'player_size', 'iab_categories'];
    options.include = [
      {
        model: models.publishers,
        attributes: ['id', 'name'],
        required: true
      }
    ];

    models.placements.count({
      where: options.where
    })
      .then(count => {
        return models.placements.findAll(options)
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
            res.status(503).send({ message: "Could not display placements at this time. Please try again later." });
          })
      })
      .catch(err => {
        res.status(503).send({ message: "Could not display placements at this time. Please try again later." });
      })
  }
  else {
    res.sendStatus(401);
  }
};

exports.listInactive = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_PLACEMENTS, null)) {
    let options = utils.generateOptions(req.body, 'placements');
    options.where.status = {
      $or: ['inactive', 'complete']
    };
    options.where.zone_id = req.user.scope_zone_id;
    console.log('BACKEND MASTER', req.body.master)
    if ((!(req.user.role & roles.SUPER_ADMIN) && !(req.user.role & roles.OPS_ADMIN)) || !req.body.master) {
      options.where.account_id = req.user.scope_account_id;
    }
    if (validators.id(req.body.id)) {
      options.where.publisher_id = req.body.id;
    }
    options.attributes = ['id', 'name', 'created_at', 'channel', 'format', 'width', 'height', 'cpm', 'status', 'player_size', 'iab_categories'];
    options.include = [
      {
        model: models.publishers,
        attributes: ['id', 'name'],
        required: true
      }
    ];

    models.placements.count({
      where: options.where
    })
      .then(count => {
        return models.placements.findAll(options)
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
            res.status(503).send({ message: "Could not display placements at this time. Please try again later." });
          })
      })
      .catch(err => {
        res.status(503).send({ message: "Could not display placements at this time. Please try again later." });
      })
  }
  else {
    res.sendStatus(401);
  }
};

exports.listDisabled = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_DISABLED_PLACEMENTS, null)) {
    let options = utils.generateOptions(req.body, 'placements');
    options.where.status = 'disabled';
    options.where.zone_id = req.user.scope_zone_id;
    console.log('BACKEND MASTER', req.body.master)
    if ((!(req.user.role & roles.SUPER_ADMIN) && !(req.user.role & roles.OPS_ADMIN)) || !req.body.master) {
      options.where.account_id = req.user.scope_account_id;
    }
    if (validators.id(req.body.id)) {
      options.where.publisher_id = req.body.id;
    }
    options.attributes = ['id', 'name', 'created_at', 'channel', 'format', 'width', 'height', 'cpm', 'status', 'player_size', 'iab_categories'];
    options.include = [
      {
        model: models.publishers,
        attributes: ['id', 'name'],
        required: true
      }
    ];

    models.placements.count({
      where: options.where
    })
      .then(count => {
        return models.placements.findAll(options)
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
            res.status(503).send({ message: "Could not display placements at this time. Please try again later." });
          })
      })
      .catch(err => {
        res.status(503).send({ message: "Could not display placements at this time. Please try again later." });
      })
  }
  else {
    res.sendStatus(401);
  }
};

exports.readOpportunityCount = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.placement_caps.findOne({

      where: { placement_id: req.body.id },

      attributes: ['current_opportunity_count']
    })
      .then(oppCount => {
        if (oppCount) {
          res.send(oppCount.dataValues.current_opportunity_count.toString());
        } else {
          res.send('0');
        }
      })
      .catch(err => {
        res.send('0');
      })
  }
  else {
    res.send('0');
  }
};

exports.read = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.placements.findOne({
      where: {
        id: req.body.id
      },
      attributes: ['id', 'name', 'notes', 'cpm', 'cpc', 'bwa_cpm', 'passback_url', 'is_revshare', 'publisher_revenue_share', 'width', 'height', 'demand_list', 'optimizer', 'is_vast_only', 'format', 'channel', 'has_bwa_video_player', 'status', 'player_size', 'domain_list_category', 'domain_list_id', 'bwa_video_player_volume', 'bwa_player_type', 'pricing_model', 'iab_categories', 'max_video_duration', 'app_store_url', 'default_domain', 'default_app_name', 'default_bundle_id', 'default_ctv_channel' ],
      include: [
        {
          model: models.placement_caps
        },
        {
          model: models.placement_brand_safety_providers
        },
        {
          model: models.placement_geo_targets
        },
        {
          model: models.publishers,
          attributes: ['id', 'name']
        }
      ]
    })
      .then(placement => {
        if (placement) {
          if (utils.isAllowed(req.user, actions.READ_PLACEMENT, placement)) {
            if (!req.user.role & roles.SUPER_ADMIN && !req.user.role & roles.OPS_ADMIN) {
              placement.bwa_cpm = 0;
            }
            res.send(placement);
          }
          else {
            res.status(401).send({ msg: 'You are not authorized' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not retrieve the placement at this time. Please try again later 1' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: "Could not retrieve the placement at this time. Please try again later 2" });
      })
  }
  else {
    res.status(406).send({ msg: 'Your input is invalid' });
  }
};

exports.update = function (req, res, next) {
  if (validators.placement(req.body, 'update')) {
    models.placements.findOne({
      where: {
        id: req.body.id
      },
      include: [
        {
          model: models.placement_brand_safety_providers,
          order: [
            ['name', 'asc']
          ]
        },
        {
          model: models.placement_caps
        },
        {
          model: models.placement_geo_targets
        }
      ]
    })
      .then(placement => {
        if (placement) {
          if (utils.isAllowed(req.user, actions.UPDATE_PLACEMENT, placement)) {
            placement.bwa_cpm = req.body.bwaCPM;
            placement.channel = req.body.channel;
            placement.cpc = req.body.cpc;
            placement.status = req.body.status;
            placement.cpm = req.body.cpm;
            placement.demand_list = req.body.demandList;
            placement.format = req.body.format;
            placement.max_video_duration = req.body.maxVideoDuration;

            placement.default_domain = req.body.defaultDomain;
            placement.default_app_name = req.body.defaultAppName;
            placement.default_bundle_id = req.body.defaultBundleId;
            placement.default_ctv_channel = req.body.defaultCtvChannel;

            placement.app_store_url = req.body.appStoreUrl;
            placement.height = req.body.height;
            placement.is_revshare = req.body.isRevshare;
            placement.is_vast_only = req.body.isVastOnly;
            placement.has_bwa_video_player = req.body.isPilotPlayer;
            placement.bwa_video_player_volume = req.body.volume;
            placement.bwa_player_type = req.body.playerType;
            placement.name = req.body.name;
            placement.passback_url = req.body.passbackUrl;
            placement.notes = req.body.notes;
            placement.optimizer = req.body.optimizer;
            placement.player_size = req.body.playerSize;
            placement.iab_categories = req.body.iabCategory;
            // iab_categories: req.body.iabCategory,
            placement.publisher_revenue_share = req.body.revShare;
            placement.width = req.body.width;
            placement.pricing_model = req.body.pricingModel;
            placement.domain_list_category = req.body.listCategory;
            placement.domain_list_id = req.body.listId;
            placement.status = placement.status === 'complete' ? 'active' : placement.status;
            return updatePlacement(placement, req.body)
              .then(response => {
                if (response) {
                  res.sendStatus(200);
                }
                else {
                  res.status(503).send({ msg: 'Unable to update a placement at this time. Please try again later.' });
                }
              })
          }
          else {
            res.status(401).send({ msg: 'You are not authorized for this operation' });
          }
        }
        else {
          res.status(404).send({ msg: 'Unable to update a placement at this time. Please try again later.' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Unable to update a placement at this time. Please try again later.' });
      })
  }
  else {
    res.status(406).send({ msg: 'Unable to update a placement at this time. Please try again later.' });
  }
};

exports.activate = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.placements.findOne({ where: { id: req.body.id } })
      .then(placement => {
        if (placement) {
          if (utils.isAllowed(req.user, actions.ACTIVATE_PLACEMENT, placement)) {
            placement.status = "active";
            return placement.save()
              .then(response => {
                res.sendStatus(200);
              })
              .catch(err => {
                res.status(503).send({ msg: 'Could not activate the placement at this time. Please try again later' });
              })
          }
          else {
            res.status(401).send({ msg: 'You are not permitted to do this operation' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not activate the placement at this time. Please try again later' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not activate the placement at this time. Please try again later' });
      })
  }
  else {
    res.status(406).send({ msg: 'Could not activate the placement at this time. Please try again later' });
  }
};

exports.deactivate = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.placements.findOne({ where: { id: req.body.id } })
      .then(placement => {
        if (placement) {
          if (utils.isAllowed(req.user, actions.DEACTIVATE_PLACEMENT, placement)) {
            placement.status = "inactive";
            return placement.save()
              .then(response => {
                res.sendStatus(200);
              })
              .catch(err => {
                res.status(503).send({ msg: 'Could not deactivate the placement at this time. Please try again later' });
              })
          }
          else {
            res.status(401).send({ msg: 'You are not permitted to do this operation' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not deactivate the placement at this time. Please try again later' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not deactivate the placement at this time. Please try again later' });
      })
  }
  else {
    res.status(406).send({ msg: 'Could not deactivate the placement at this time. Please try again later' });
  }
};

exports.tag = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.placements.findOne({
      where: {
        id: req.body.id
      },
      include: [
        {
          model: models.placement_caps
        },
        {
          model: models.placement_brand_safety_providers
        },
        {
          model: models.placement_geo_targets
        },
        {
          model: models.publishers,
          attributes: ['id', 'name']
        }
      ]
    })
      .then(placement => {
        if (placement) {
          if (utils.isAllowed(req.user, actions.READ_PLACEMENT, placement)) {
            res.send(generateTag(placement))
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
// VIDEO PLAYER TAG
exports.playerTag = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.placements.findOne({
      where: {
        id: req.body.id
      },
      include: [
        {
          model: models.placement_caps
        },
        {
          model: models.placement_brand_safety_providers
        },
        {
          model: models.placement_geo_targets
        },
        {
          model: models.publishers,
          attributes: ['id', 'name']
        }
      ]
    })
      .then(placement => {
        if (placement) {
          if (utils.isAllowed(req.user, actions.READ_PLACEMENT, placement)) {
            res.send(generateVideoPlayerTag(placement))
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

// GENERATE VIDEO PLAYER TAG

function generateVideoPlayerTag(placement) {
  if (placement.has_bwa_video_player) {
    let mute;
    let isAutoplay;
    if (placement.bwa_video_player_volume < 1) {
      mute = 'muted';
    }
    else {
      mute = '';
    }
    // if (placement.channel == 'mobile_web') {
    //   isAutoplay = ''

    // } else {
    isAutoplay = 'autoplay'
    // }
    if (placement.is_vast_only) {
      return `<link rel="stylesheet" href="https://player.pilotxcdn.com/player.css" />
<!-- VIDEO PLAYER -->
<div class="pilot-video ${placement.bwa_player_type}">
           <video id='pid-${placement.id}' class="video-js vjs-default-skin vjs-big-play-centered pilot-player" width='${placement.width}' height='${placement.height}' data-view='${placement.channel}' value='https://adn.pilotx.tv/vast?pid=${placement.id}&pageurl={PAGEURL}&domain={DOMAIN}&w=${placement.width}&h=${placement.height}'
                ${isAutoplay} ${mute} playsinline>
                  <source src="https://player.pilotxcdn.com/pilot.mp4" type="video/mp4"></source>
            </video>
        </div>
  <!-- VIDEO PLAYER -->
  <script src="https://imasdk.googleapis.com/js/sdkloader/ima3.js"></script>
    <script src="https://player.pilotxcdn.com/player.js"></script>`
    }
    else {
      return `<link rel="stylesheet" href="https://player.pilotxcdn.com/player.css" />
<!-- VIDEO PLAYER -->
<div class="pilot-video ${placement.bwa_player_type}">
           <video id='pid-${placement.id}' class="video-js vjs-default-skin vjs-big-play-centered pilot-player" width='${placement.width}' height='${placement.height}' data-view='${placement.channel}'  value='https://adn.pilotx.tv/op?pid=${placement.id}&pageurl={PAGEURL}&domain={DOMAIN}&w=${placement.width}&h=${placement.height}'
                ${isAutoplay} ${mute} playsinline>
                  <source src="https://player.pilotxcdn.com/pilot.mp4" type="video/mp4"></source>
            </video>
        </div>
  <!-- VIDEO PLAYER -->
  <script src="https://imasdk.googleapis.com/js/sdkloader/ima3.js"></script>
    <script src="https://player.pilotxcdn.com/player.js"></script>`
    }
  } else {
    return null;
  }
}

// GENERATE END VIDEO PLAYER TAG

function generateTag(placement) {
  if (placement.format === 'display') {
    if (process.env.NODE_ENV == 'development' || !process.env.NODE_ENV) {
      return `<script type="text/javascript" bwa-pid="${placement.id}" bwa-width="${placement.width}" bwa-height="${placement.height}" bwa-click="" bwa-cb="" src="//display.bwacdn.com/ads.js"></script>`

    } else {
      return `<script type="text/javascript" bwa-pid="${placement.id}" bwa-width="${placement.width}" bwa-height="${placement.height}" bwa-click="" bwa-cb="" src="//display.pilotx.tv/ads.js"></script>`

    }
   }
  if (placement.is_vast_only) {
    if (process.env.NODE_ENV == 'development' || !process.env.NODE_ENV) {
      return `http://adn.bwaserver.com/vast?pid=${placement.id}&pageurl={PAGEURL}&domain={DOMAIN}&w={W}&h={H}&ip={IP}&ua={UA}&devid={DEVICEID}&appname={APPNAME}&bundleid={BUNDLEID}&appurl={APPURL}&idfa={IDFA}&idfamd5={IDFAMD5}&idfasha1={IDFASHA1}&aid={AID}&aidmd5={AIDMD5}&aidsha1={AIDSHA1}`

         }
    else{
      return `https://adn.pilotx.tv/vast?pid=${placement.id}&pageurl={PAGEURL}&domain={DOMAIN}&w={W}&h={H}&ip={IP}&ua={UA}&devid={DEVICEID}&appname={APPNAME}&bundleid={BUNDLEID}&appurl={APPURL}&idfa={IDFA}&idfamd5={IDFAMD5}&idfasha1={IDFASHA1}&aid={AID}&aidmd5={AIDMD5}&aidsha1={AIDSHA1}`

    }
 }

  else {
    if (process.env.NODE_ENV == 'development' || !process.env.NODE_ENV) {
      return `http://adn.bwaserver.com/op?pid=${placement.id}&pageurl={PAGEURL}&domain={DOMAIN}&w={W}&h={H}`;
    }
    else{
      return `https://adn.pilotx.tv/op?pid=${placement.id}&pageurl={PAGEURL}&domain={DOMAIN}&w={W}&h={H}`;
    }
  }
}

exports.listDemand = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.placements.findOne({
      where: {
        id: req.body.id
      }
    })
      .then(placement => {
        if (placement) {
          if (utils.isAllowed(req.user, actions.UPDATE_PLACEMENT, placement)) {
            let obj = {}
            if (req.body.master) {
              obj = {
                zone_id: req.user.scope_zone_id,
                format: placement.format,
                channel: placement.channel,
                name: {
                  $iLike: `%${req.body.searchTerm}%`
                },
                status: {
                  $or: ['active', 'inactive', 'disabled', 'capped', 'complete']
                },
                max_video_duration: {
                  $lte: placement.max_video_duration
                }
              }
            }
            else {
              obj = {
                account_id: req.user.scope_account_id,
                format: placement.format,
                channel: placement.channel,
                name: {
                  $iLike: `%${req.body.searchTerm}%`
                },
                status: {
                  $or: ['active', 'inactive', 'disabled', 'capped', 'complete']
                },
                // cast({ max_video_duration: { $gt: 25 }}, 'int')
                max_video_duration: {
                  $lte: placement.max_video_duration
                }
              }
            }
            if (placement.format == 'display') {
              obj.width = placement.width;
              obj.height = placement.height;
            }
            return models.flights.findAll({
              where: obj
            })
              .then(results => {
                res.send(results);
              })
              .catch(err => {
                res.status(503).send({ msg: 'Could not display the demand at this time. Please try again later.' });
              })
          }
          else {
            res.status(401).send({ msg: 'Could not display the demand at this time. Please try again later.' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not display the demand at this time. Please try again later.' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not display the demand at this time. Please try again later.' });
      })
  }
  else {
    res.status(406).send({ msg: 'Could not display the demand at this time. Please try again later.' });
  }
};

exports.demandList = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.placements.findOne({
      where: {
        id: req.body.id
      }
    })
      .then(placement => {
        if (placement) {
          if (utils.isAllowed(req.user, actions.UPDATE_PLACEMENT, placement)) {
            return getDemandList(placement.demand_list)
              .then(response => {
                if (response.success) {
                  res.send(response.payload);
                }
                else {
                  res.status(503).send({ msg: 'Could not display the demand at this time. Please try again later.' });
                }
              })
          }
          else {
            res.status(401).send({ msg: 'Could not display the demand at this time. Please try again later.' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not display the demand at this time. Please try again later.' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not display the demand at this time. Please try again later.' });
      })
  }
  else {
    res.status(406).send({ msg: 'Could not display the demand at this time. Please try again later.' });
  }
};

async function getDemandList(list) {
  try {
    let arr = [];
    for (let i = 0; i < list.length; i++) {
      arr.push(await models.flights.findOne({
        where: {
          id: list[i]
        },
        attributes: ['id', 'name', 'cpm', 'status', 'deal_id']
      }));
    }

    return {
      success: true,
      payload: {
        demandList: arr,
        demandIds: list
      },
    }
  }
  catch (err) {
    return {
      success: false
    }
  }
}

exports.updateDemand = function (req, res, next) {
  if (validators.id(req.body.id) && validators.demandList(req.body.demandIds)) {
    models.placements.findOne({
      where: {
        id: req.body.id
      }
    })
      .then(placement => {
        if (placement) {
          if (utils.isAllowed(req.user, actions.UPDATE_PLACEMENT, placement)) {
            return updateDemand(placement, req.body.demandIds, req.body.demandPrioritization)
              .then(response => {
                if (response) {
                  res.sendStatus(200);
                }
                else {
                  res.status(503).send({ msg: 'Could not update the demand list at this time. Please try again later.' });
                }
              })
          }
          else {
            res.status(401).send({ msg: 'Could not update the demand list at this time. Please try again later.' });
          }
        }
        else {
          res.status(404).send({ msg: 'Could not update the demand list at this time. Please try again later.' });
        }
      })
      .catch(err => {
        res.status(503).send({ msg: 'Could not update the demand list at this time. Please try again later.' });
      })
  }
  else {
    res.status(406).send({ msg: 'Input is not valid ' });
  }
};

async function updateDemand(placement, ids, demandPrioritization) {
  try {
    // let currentIds = placement.demand_list;
    // for (let i = 0; i < currentIds; i++) {
    //   if (!ids.includes(currentIds[i])) {
    //     let flight = await models.flights.findOne({
    //       where: {
    //         id: currentIds[i]
    //       }
    //     });
    //     let arr = flight.direct_deal_ids;
    //     const index = arr.indexOf(placement.id);
    //     arr.splice(index, 1);
    //     flight.direct_deal_ids = arr;
    //     flight.direct_deal_ids.splice(flight.direct_deal_ids.indexOf(placement.id), 1);
    //     if (!flight.direct_deal_ids.length) {
    //       flight.is_direct_deal = false;
    //     }
    //     await flight.save();
    //   }
    // }
    // for (let i = 0; i < ids.length; i++) {
    //   if (!currentIds.includes(ids[i])) {
    //     let flight = await models.flights.findOne({
    //       where: {
    //         id: ids[i]
    //       }
    //     });
    //     let arr = flight.direct_deal_ids;
    //     arr.push(placement.id);
    //     flight.is_direct_deal = true;
    //     flight.direct_deal_ids = arr;
    //     await flight.save();
    //   }
    // }
    placement.demand_list = ids;
    placement.demand_prioritization_type = demandPrioritization;
    await placement.save();
    return true;
  }
  catch (err) {
    console.log(err);
    return false;
  }
}
