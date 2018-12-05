const utils = require("../utils");
const val = require("../utils/validators");
const models = require("../models");
const actions = require("../utils/actions");
const ffprobe = require("ffprobe");
const ffprobeStatic = require("ffprobe-static");
const moment = require("moment");
const validators = require("../utils/validators");
let Client = require("ssh2-sftp-client");
const shortid = require("shortid");
const fs = require("fs");
const shell = require("shelljs");
const xml = require("xml");
const roles = require("../utils/roles");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
/**
 * Flight creation async function
 * @param obj - the flight that was sent by the user
 * @param campaign - campaign details for the flight
 * @param user - user details
 * @returns {Promise.<boolean>} - after creating all the flight params in various tables
 */

exports.tag = function(req, res, next) {
  if (validators.id(req.body.id)) {
    models.flights
      .findOne({
        where: {
          id: req.body.id
        }
      })
      .then(flight => {
        if (flight) {
          if (utils.isAllowed(req.user, actions.UPDATE_FLIGHT, flight)) {
            res.send({
              id: flight.id,
              account_id: flight.account_id,
              advertiser_id: flight.advertiser_id,
              campaign_id: flight.campaign_id,
              zone_id: flight.zone_id,
              is_retargeted: flight.is_retargeted
            });
          } else {
            res.sendStatus(401);
          }
        } else {
          res.sendStatus(404);
        }
      })
      .catch(err => {
        res.sendStatus(503);
      });
  } else {
    res.sendStatus(406);
  }
};

exports.updateSupply = function(req, res, next) {
  let toAdd = req.body.toAdd;
  let toRemove = req.body.toRemove;
  if (toAdd.length > 0) {
    toAdd.map((mid, i) => {
      models.placements
        .findOne({
          where: {
            id: mid
          }
        })
        .then(placement => {
          if (placement) {
            if (
              utils.isAllowed(req.user, actions.UPDATE_PLACEMENT, placement)
            ) {
              return addDemand(placement, req.body.id).then(response => {
                if (i === toAdd.length - 1 && toRemove.length < 1) {
                  res.sendStatus(200);
                }
              });
            }
          }
        })
        .catch(err => {
          res
            .status(503)
            .send({
              msg:
                "Could not update the demand list at this time. Please try again later."
            });
        });
    });
  }
  if (toRemove.length > 0) {
    toRemove.map((mid, i) => {
      models.placements
        .findOne({
          where: {
            id: mid
          }
        })
        .then(placement => {
          if (placement) {
            if (
              utils.isAllowed(req.user, actions.UPDATE_PLACEMENT, placement)
            ) {
              return removeDemand(placement, req.body.id).then(response => {
                if (i === toRemove.length - 1) {
                  res.sendStatus(200);
                }
              });
            }
          }
        })
        .catch(err => {
          res
            .status(503)
            .send({
              msg:
                "Could not update the demand list at this time. Please try again later."
            });
        });
    });
  }
  // else {
  //   res.sendStatus(200);
  // }
};

async function addDemand(placement, id) {
  try {
    placement.demand_list = [...placement.demand_list, id];
    await placement.save();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function removeDemand(placement, id) {
  let demandList = [];
  try {
    demandList = placement.demand_list.filter(item => item !== id);
    placement.demand_list = demandList;
    await placement.save();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

exports.listSupply = function(req, res, next) {
  if (validators.id(req.body.id)) {
    models.flights
      .findOne({
        where: {
          id: req.body.id
        }
      })
      .then(flight => {
        if (flight) {
          if (utils.isAllowed(req.user, actions.UPDATE_FLIGHT, flight)) {
            let obj = {};
            if (req.body.master) {
              obj = {
                zone_id: req.user.scope_zone_id,
                format: flight.format,
                channel: flight.channel,
                name: {
                  $iLike: `%${req.body.searchTerm}%`
                },
                status: {
                  $or: ["active"]
                }
              };
            } else {
              obj = {
                account_id: req.user.scope_account_id,

                format: flight.format,
                channel: flight.channel,
                name: {
                  $iLike: `%${req.body.searchTerm}%`
                },
                status: {
                  $or: ["active"]
                }
              };
            }
            if (flight.format == "display") {
              obj.width = flight.width;
              obj.height = flight.height;
            }
            return models.placements
              .findAll({
                where: obj
              })
              .then(results => {
                res.send(results);
              })
              .catch(err => {
                res
                  .status(503)
                  .send({
                    msg:
                      "Could not display the supply at this time. Please try again later."
                  });
              });
          } else {
            res
              .status(401)
              .send({
                msg:
                  "Could not display the supply at this time. Please try again later."
              });
          }
        } else {
          res
            .status(404)
            .send({
              msg:
                "Could not display the supply at this time. Please try again later."
            });
        }
      })
      .catch(err => {
        res
          .status(503)
          .send({
            msg:
              "Could not display the supply at this time. Please try again later."
          });
      });
  } else {
    res
      .status(406)
      .send({
        msg:
          "Could not display the supply at this time. Please try again later."
      });
  }
};

exports.supplyList = function(req, res, next) {
  if (validators.id(req.body.id)) {
    models.placements
      .findAll({
        where: {
          demand_list: {
            $contains: [req.body.id]
          },
          status: {
            $or: ["active"]
          }
        }
      })
      .then(placement => {
        res.send(placement);
      })
      .catch(err => {
        res
          .status(503)
          .send({
            msg:
              "Could not display the demand at this time. Please try again later."
          });
      });
  } else {
    res
      .status(406)
      .send({
        msg:
          "Could not display the demand at this time. Please try again later."
      });
  }
};

async function getDemandList(list) {
  try {
    let arr = [];
    for (let i = 0; i < list.length; i++) {
      arr.push(
        await models.flights.findOne({
          where: {
            id: list[i]
          },
          attributes: ["id", "name", "cpm", "status"]
        })
      );
    }

    return {
      success: true,
      payload: {
        demandList: arr,
        demandIds: list
      }
    };
  } catch (err) {
    return {
      success: false
    };
  }
}

async function createFlight(obj, campaign, user) {
  try {
    // Create Flight
    const flight = {
      created_at: moment()
        .utc()
        .unix(),
      name: obj.flight.name,
      notes: obj.flight.notes,
      is_skippable:obj.flight.is_skippable,
      cpm: obj.flight.cpm,
      flight_type: obj.flight.flight_type,
      cpc: obj.flight.cpc,
      clickthrough_url: obj.flight.clickthrough_url,
      click_tracker: obj.flight.click_tracker,
      is_retargeted: obj.flight.is_retargeted,
      impression_tracker: obj.flight.impression_tracker,
      wrapper_url: obj.flight.wrapper_url,
      wrapper_source_platform: obj.flight.wrapper_source_platform,
      is_direct_deal: false,
      direct_deal_ids: [],
      user_frequency_cap: obj.flight.user_frequency_cap,
      domain_list_id: obj.flight.domain_list_id,
      domain_list_category: obj.flight.domain_list_category,
      is_muted_allowed: obj.flight.is_muted_allowed,
      is_visible_only: obj.flight.is_visible_only,
      start_time: obj.flight.start_time,
      end_time: obj.flight.end_time,
      demand_source_type: obj.flight.demand_source_type,
      pacing_category: obj.flight.pacing_category,
      user_agent: obj.flight.user_agent,
      desktop_browser_targeting: obj.flight.desktop_browser_targeting,
      rtb_source: obj.flight.rtb_source,

      deal_id: obj.flight.deal_id,
      deal_cpmfloor: obj.flight.deal_cpmfloor,

      format: obj.flight.format,
      max_video_duration: obj.flight.maxVideoDuration,
      channel: obj.flight.channel,
      vast_document: generateVastDocument(obj, campaign.advertiser_id),
      wrapper_vast: generateWrapperVast(
        obj,
        campaign.account_id,
        campaign.advertiser_id
      ),
      // wrapper_vast: generateWrapperVast(obj, user.scope_account_id, campaign.advertiser_id),
      timezone: obj.flight.timezone,
      zone_id: user.scope_zone_id,
      // account_id: user.scope_account_id,
      account_id: campaign.account_id,
      advertiser_id: campaign.advertiser_id,
      campaign_id: campaign.id,
      status: obj.flight.status,
      height: obj.flight.height,
      width: obj.flight.width,
      player_size: obj.flight.player_size,
      is_vast_only: obj.flight.is_vast_only,
      iab_categories: obj.flight.iab_categories,
      companion_clickthrough_url: ""
    };
    const createdFlight = await models.flights.create(flight);
    // Create video creative
    if (obj.hasOwnProperty("video")) {
      const video = {
        created_at: moment()
          .utc()
          .unix(),
        name: obj.video.name,
        notes: obj.video.notes,
        filename: obj.video.filename,
        alt_text: obj.video.alt_text,
        party: obj.video.party,
        js_tag: obj.video.js_tag,
        width: obj.video.width,
        height: obj.video.height,
        content_type: obj.video.content_type,
        bitrate: obj.video.bitrate,
        duration: obj.video.duration,
        zone_id: user.scope_zone_id,
        // account_id: user.scope_account_id,
        account_id: campaign.account_id,
        advertiser_id: campaign.advertiser_id,
        campaign_id: campaign.id,
        flight_id: createdFlight.id
      };
      const createdVideo = await models.video_creatives.create(video);
      createdFlight.wrapper_vast = createdFlight.wrapper_vast
        .replace("{FID}", createdFlight.id)
        .replace("{CREATIVEID}", createdVideo.id);

        await saveVideoWithId('create', obj.video.filename, createdFlight.id)

      await createdFlight.save();
      // Create companions
      for (let i = 0; i < obj.video.companions; i++) {
        const companion = {
          created_at: moment()
            .utc()
            .unix(),
          name: obj.video.companions[i].name,
          notes: obj.video.companions[i].notes,
          is_companion_creative: true,
          filename: obj.video.companions[i].filename,
          alt_text: obj.video.companions[i].alt_text,
          party: obj.video.companions[i].party,
          js_tag: obj.video.companions[i].js_tag,
          width: obj.video.companions[i].width,
          height: obj.video.companions[i].height,
          zone_id: user.scope_zone_id,
          account_id: user.scope_account_id,
          account_id: campaign.account_id,
          // advertiser_id: campaign.advertiser_id,
          campaign_id: campaign.id,
          flight_id: createdFlight.id,
          video_creative_id: createdVideo.id
        };
        await models.display_creatives.create(companion);
      }
    }
    // Create display creative
    if (obj.hasOwnProperty("display")) {
      const display = {
        created_at: moment()
          .utc()
          .unix(),
        name: obj.display.name,
        notes: obj.display.notes,
        is_companion_creative: false,
        filename: obj.display.filename,
        alt_text: obj.display.alt_text,
        party: obj.display.party,
        js_tag: obj.display.js_tag,
        width: obj.display.width,
        height: obj.display.height,
        zone_id: user.scope_zone_id,
        // account_id: user.scope_account_id,
        account_id: campaign.account_id,
        advertiser_id: campaign.advertiser_id,
        campaign_id: campaign.id,
        flight_id: createdFlight.id,
        video_creative_id: null
      };
      await models.display_creatives.create(display);
      await saveDisplayWithId('create', obj.display.filename, createdFlight.id)
    }
    // Create brand safety
    for (let i = 0; i < obj.brandSafety.length; i++) {
      const item = {
        name: obj.brandSafety[i].name,
        is_active: obj.brandSafety[i].is_active,
        flight_id: createdFlight.id
      };
      await models.flight_brand_safety_providers.create(item);
    }
    // Create day parting
    for (let i = 0; i < obj.dayParting.length; i++) {
      const dayParting = {
        start_day: obj.dayParting[i].start_day,
        end_day: obj.dayParting[i].end_day,
        start_hour: obj.dayParting[i].start_hour,
        end_hour: obj.dayParting[i].end_hour,
        flight_id: createdFlight.id
      };
      await models.flight_day_partings.create(dayParting);
    }
    // Create geo targets
    let geos = [];
    obj.targetGeo.forEach(item => {
      geos.push({
        is_include: item.is_include,
        country: item.type === "country" ? item.value : "",
        province: item.type === "province" ? item.value : "",
        city: item.type === "city" ? item.value : "",
        dma: item.type === "dma" ? item.value : "",
        postal_code: item.type === "postal_code" ? item.value : "",
        flight_id: createdFlight.id
      });
    });

    await models.flight_geo_targets.bulkCreate(geos);
    // Create goals
    for (let i = 0; i < obj.goals.length; i++) {
      const goal = {
        impressions: obj.goals[i].impressions,
        interval: obj.goals[i].interval,
        flight_id: createdFlight.id,
        is_budget: obj.goals[i].is_budget,
        current_impression_count: 0
      };
      await models.flight_goals.create(goal);
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * Cloned flight creation async function
 * @param obj - the flight that was cloned
 * @param campaign - campaign details for the flight
 * @param user - user details
 * @returns {Promise.<boolean>} - after creating all the flight params in various tables
 */
async function cloneFlight(obj, campaign, user) {
  try {
    // Create Flight
    const flight = {
      created_at: moment()
        .utc()
        .unix(),
      name: obj.flight.name,
      notes: obj.flight.notes,
      cpm: obj.flight.cpm,
      flight_type: obj.flight.flight_type,
      cpc: obj.flight.cpc,
      clickthrough_url: obj.flight.clickthrough_url,
      is_skippable: obj.flight.is_skippable,
      click_tracker: obj.flight.click_tracker,
      is_retargeted: obj.flight.is_retargeted,
      impression_tracker: obj.flight.impression_tracker,
      wrapper_url: obj.flight.wrapper_url,
      wrapper_source_platform: obj.flight.wrapper_source_platform,
      is_direct_deal: false,
      direct_deal_ids: [],
      user_frequency_cap: obj.flight.user_frequency_cap,
      domain_list_id: obj.flight.domain_list_id,
      domain_list_category: obj.flight.domain_list_category,
      is_muted_allowed: obj.flight.is_muted_allowed,
      is_visible_only: obj.flight.is_visible_only,
      start_time: obj.flight.start_time,
      end_time: obj.flight.end_time,
      demand_source_type: obj.flight.demand_source_type,
      pacing_category: obj.flight.pacing_category,
      user_agent: obj.flight.user_agent,
      desktop_browser_targeting: obj.flight.desktop_browser_targeting,
      rtb_source: obj.flight.rtb_source,

      deal_id: obj.flight.deal_id,
      deal_cpmfloor: obj.flight.deal_cpmfloor,

      format: obj.flight.format,
      max_video_duration: obj.flight.maxVideoDuration,
      channel: obj.flight.channel,
      vast_document: generateVastDocument(obj, campaign.advertiser_id),
      // wrapper_vast: generateWrapperVast(obj, user.scope_account_id, campaign.advertiser_id),
      wrapper_vast: generateWrapperVast(
        obj,
        campaign.account_id,
        campaign.advertiser_id
      ),
      timezone: obj.flight.timezone,
      zone_id: user.scope_zone_id,
      // account_id: user.scope_account_id,
      account_id: campaign.account_id,
      advertiser_id: campaign.advertiser_id,
      campaign_id: campaign.id,
      status: obj.flight.status,
      height: obj.flight.height,
      width: obj.flight.width,
      player_size: obj.flight.player_size,
      is_vast_only: obj.flight.is_vast_only,
      iab_categories: obj.flight.iab_categories,
      companion_clickthrough_url: ""
    };
    const createdFlight = await models.flights.create(flight);
    // Create video creative
    if (obj.hasOwnProperty("video")) {
      if (obj.video.id !== 0) {
        const video = {
          created_at: moment()
            .utc()
            .unix(),
          name: obj.video.name,
          notes: obj.video.notes,
          filename: obj.video.filename,
          alt_text: obj.video.alt_text,
          party: obj.video.party,
          js_tag: obj.video.js_tag,
          width: obj.video.width,
          height: obj.video.height,
          content_type: obj.video.content_type,
          bitrate: obj.video.bitrate,
          duration: obj.video.duration,
          zone_id: user.scope_zone_id,
          // account_id: user.scope_account_id,
          account_id: campaign.account_id,
          advertiser_id: campaign.advertiser_id,
          campaign_id: campaign.id,
          flight_id: createdFlight.id
        };
        const createdVideo = await models.video_creatives.create(video)
        // await saveVideoWithId(data.display.filename, createdFlight.id, obj.flight.id)
        await saveVideoWithId('clone', obj.video.filename, createdFlight.id, obj.flight.id)
        // Create companions
        for (let i = 0; i < obj.video.companions; i++) {
          if (obj.video.companions.id !== 0) {
            // DUPLICATE FROM CDN
          } else {
            const companion = {
              created_at: moment()
                .utc()
                .unix(),
              name: obj.video.companions[i].name,
              notes: obj.video.companions[i].notes,
              is_companion_creative: true,
              filename: obj.video.companions[i].filename,
              alt_text: obj.video.companions[i].alt_text,
              party: obj.video.companions[i].party,
              js_tag: obj.video.companions[i].js_tag,
              width: obj.video.companions[i].width,
              height: obj.video.companions[i].height,
              zone_id: user.scope_zone_id,
              // account_id: user.scope_account_id,
              account_id: campaign.account_id,
              advertiser_id: campaign.advertiser_id,
              campaign_id: campaign.id,
              flight_id: createdFlight.id,
              video_creative_id: createdVideo.id
            };
            // obj.flight.
            await models.display_creatives.create(companion);
          }
        }
      } else {
        const video = {
          created_at: moment()
            .utc()
            .unix(),
          name: obj.video.name,
          notes: obj.video.notes,
          filename: obj.video.filename,
          alt_text: obj.video.alt_text,
          party: obj.video.party,
          js_tag: obj.video.js_tag,
          width: obj.video.width,
          height: obj.video.height,
          content_type: obj.video.content_type,
          bitrate: obj.video.bitrate,
          duration: obj.video.duration,
          zone_id: user.scope_zone_id,
          // account_id: user.scope_account_id,
          account_id: campaign.account_id,
          advertiser_id: campaign.advertiser_id,
          campaign_id: campaign.id,
          flight_id: createdFlight.id
        };
        await saveVideoWithId('clone', obj.video.filename, createdFlight.id, obj.flight.id)
        const createdVideo = await models.video_creatives.create(video);
        // Create companions
        for (let i = 0; i < obj.video.companions; i++) {
          if (obj.video.companions.id !== 0) {
            // DUPLICATE FROM CDN
          } else {
            const companion = {
              created_at: moment()
                .utc()
                .unix(),
              name: obj.video.companions[i].name,
              notes: obj.video.companions[i].notes,
              is_companion_creative: true,
              filename: obj.video.companions[i].filename,
              alt_text: obj.video.companions[i].alt_text,
              party: obj.video.companions[i].party,
              js_tag: obj.video.companions[i].js_tag,
              width: obj.video.companions[i].width,
              height: obj.video.companions[i].height,
              zone_id: user.scope_zone_id,
              // account_id: user.scope_account_id,
              account_id: campaign.account_id,
              advertiser_id: campaign.advertiser_id,
              campaign_id: campaign.id,
              flight_id: createdFlight.id,
              video_creative_id: createdVideo.id
            };
            await models.display_creatives.create(companion);
          }
        }
      }
    }
    // Create display creative
    if (obj.hasOwnProperty("display")) {
      const display = {
        created_at: moment()
          .utc()
          .unix(),
        name: obj.display.name,
        notes: obj.display.notes,
        is_companion_creative: false,
        filename: obj.display.filename,
        alt_text: obj.display.alt_text,
        party: obj.display.party,
        js_tag: obj.display.js_tag,
        width: obj.display.width,
        height: obj.display.height,
        zone_id: user.scope_zone_id,
        // account_id: user.scope_account_id,
        account_id: campaign.account_id,
        advertiser_id: campaign.advertiser_id,
        campaign_id: campaign.id,
        flight_id: createdFlight.id,
        video_creative_id: null
      };

      await saveDisplayWithId('clone', obj.display.filename, createdFlight.id, obj.flight.id)
      await models.display_creatives.create(display);
    }
    // Create brand safety
    for (let i = 0; i < obj.brandSafety.length; i++) {
      const item = {
        name: obj.brandSafety[i].name,
        is_active: obj.brandSafety[i].is_active,
        flight_id: createdFlight.id
      };
      await models.flight_brand_safety_providers.create(item);
    }
    // Create day parting
    for (let i = 0; i < obj.dayParting.length; i++) {
      const dayParting = {
        start_day: obj.dayParting[i].start_day,
        end_day: obj.dayParting[i].end_day,
        start_hour: obj.dayParting[i].start_hour,
        end_hour: obj.dayParting[i].end_hour,
        flight_id: createdFlight.id
      };
      await models.flight_day_partings.create(dayParting);
    }
    // Create geo targets
    let geos = [];
    obj.targetGeo.forEach(item => {
      geos.push({
        is_include: item.is_include,
        country: item.type === "country" ? item.value : "",
        province: item.type === "province" ? item.value : "",
        city: item.type === "city" ? item.value : "",
        dma: item.type === "dma" ? item.value : "",
        postal_code: item.type === "postal_code" ? item.value : "",
        flight_id: createdFlight.id
      });
    });

    await models.flight_geo_targets.bulkCreate(geos);
    // Create goals
    for (let i = 0; i < obj.goals.length; i++) {
      const goal = {
        impressions: obj.goals[i].impressions,
        interval: obj.goals[i].interval,
        flight_id: createdFlight.id,
        is_budget: obj.goals[i].is_budget,
        current_impression_count: 0
      };
      await models.flight_goals.create(goal);
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * VAST document generator
 * @param data - data that was sent by the user
 * @param advertiser_id
 * @returns {*} - XML string
 */
function generateVastDocument(data, advertiser_id) {
  // console.log('DATA = ', data.flight.id); 
  const isSkippable = data.flight.is_skippable == 'none'? '00:00:00':data.flight.is_skippable == '5 Seconds'?'00:00:05':'00:00:15';
  let creativeDomain;
  if (process.env.NODE_ENV == "development" || !process.env.NODE_ENV) {
    creativeDomain = `http://video.bwacdn.com/${data.flight.id}`;
  } else {
    creativeDomain = `https://video.pilotxcdn.com/${data.flight.id}`;
  }
  if (data.flight.format === "video") {
    const obj = {};

    if (
      data.flight.demand_source_type === "first_party" &&
      data.flight.is_vast_only
    ) {
      obj.VAST = [
        {
          _attr: {
            version: "3.0"
          }
        },
        {
          Ad: [
            {
              _attr: {
                id: `${data.flight.id}${data.flight.campaignId}`
              }
            },
            {
              InLine: [
                {
                  AdSystem: [
                    {
                      _attr: {
                        version: "1.0"
                      }
                    },
                    "PILOTX"
                  ]
                },
                {
                  AdTitle: "BWAWF"
                },
                {
                  Survey: {
                    _cdata: "{ADSERVER}/surv?{PARAMS}"
                  }
                },
                {
                  Advertiser: advertiser_id
                },
                {
                  Error: {
                    _cdata: "{ADSERVER}//err?err=[ERRORCODE]&{PARAMS}"
                  }
                },
                {
                  Impression: {
                    _cdata: "{ADSERVER}/imp?{PARAMS}"
                  }
                },
                {
                  Creatives: [
                    {
                      Creative: [
                        {
                          Linear: [
                            isSkippable !=='00:00:00' ?{
                              _attr: {
                                skipoffset:`${isSkippable}`
                              }
                            }:'',
                            {
                              AdParameters: {
                                _cdata: ""
                              }
                            },
                            {
                              Duration: {
                                _cdata: `00:00:${data.video.duration}`
                              }
                            },
                            {
                              MediaFiles: [
                                {
                                  MediaFile: {
                                    _attr: {
                                      id: `${data.video.id}`,
                                      delivery: "progressive",
                                      type: `video/mp4`,
                                      width: `${data.flight.width}`,
                                      height: `${data.flight.height}`,
                                      bitrate: `${data.video.bitrate}`
                                    },
                                    _cdata: `${creativeDomain}/${
                                      data.video.filename.split(".")[0]}.mp4`
                                  }
                                },
                                {
                                  MediaFile: {
                                    _attr: {
                                      id: `${data.video.id}`,
                                      delivery: "progressive",
                                      type: `video/webm`,
                                      width: `${data.flight.width}`,
                                      height: `${data.flight.height}`,
                                      bitrate: `${data.video.bitrate}`
                                    },
                                    _cdata: `${creativeDomain}/${
                                      data.video.filename.split(".")[0]}.webm`
                                  }
                                }
                              ]
                            },
                          data.flight.channel !=='desktop'?  {
                              Extensions: [
                            {
                              Extension: [
                            
                            {
                              CustomTracking: [
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "skip"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=skip&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "engagedView"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=engagedView&{PARAMS}"
                                  }
                                }

                              ]
                            }
                          ]
                        }
                      ]
                    } :     {
                      Extensions: {
                        _cdata: ""
                      }
                    },
                            {
                              TrackingEvents: [
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "creativeView"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=creativeView&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "skip"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=skip&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "start"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=start&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "firstQuartile"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=firstQuartile&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "midpoint"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=midpoint&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "thirdQuartile"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=thirdQuartile&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "complete"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=complete&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "mute"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=mute&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "unmute"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=unmute&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "pause"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=pause&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "rewind"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=rewind&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "resume"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=resume&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "fullscreen"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=fullscreen&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "exitFullscreen"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=exitFullScreen&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "expand"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=expand&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "collapse"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=collapse&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "acceptInvitation"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=acceptInvitation&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "close"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=close&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "progress"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=progress&{PARAMS}"
                                  }
                                }
                              ]
                            },
                            {
                              VideoClicks: [
                                {
                                  ClickThrough: {
                                    _cdata: data.flight.clickthrough_url
                                  }
                                },
                                {
                                  ClickTracking: {
                                    _cdata: "{ADSERVER}/ev?event=click&{PARAMS}"
                                  }
                                },
                                {
                                  ClickTracking: {
                                    _cdata: data.flight.click_tracker
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];
    }
    //new for vast_only RTB
    else if (
      data.flight.demand_source_type === "rtb" &&
      data.flight.is_vast_only
    ) {
      obj.VAST = [
        {
          _attr: {
            version: "3.0"
          }
        },
        {
          Ad: [
            {
              _attr: {
                id: `${data.flight.id}${data.flight.campaignId}`
              }
            },
            {
              Wrapper: [
                {
                  AdSystem: [
                    {
                      _attr: {
                        version: "1.0"
                      }
                    },
                    "PILOTX"
                  ]
                },
                {
                  VASTAdTagURI: {
                    _cdata: "{ADSERVER}/rtb?{PARAMS}"
                  }
                },
                {
                  Error: {
                    _cdata: "{ADSERVER}/err?{PARAMS}"
                  }
                },
                {
                  Impression: {
                    _cdata: "{ADSERVER}/imp?{PARAMS}"
                  }
                },
                {
                  Creatives: [
                    {
                      Creative: [
                        {
                          Linear: [
                            {
                              TrackingEvents: [
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "creativeView"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=creativeView&{PARAMS}"
                                  }
                                },

                                {
                                  Tracking: {
                                    _attr: {
                                      event: "skip"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=skip&{PARAMS}"
                                  }
                                },

                                {
                                  Tracking: {
                                    _attr: {
                                      event: "start"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=start&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "firstQuartile"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=firstQuartile&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "midpoint"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=midpoint&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "thirdQuartile"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=thirdQuartile&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "complete"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=complete&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "mute"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=mute&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "unmute"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=unmute&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "pause"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=pause&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "rewind"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=rewind&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "resume"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=resume&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "fullscreen"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=fullscreen&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "exitFullscreen"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=exitFullScreen&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "expand"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=expand&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "collapse"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=collapse&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "acceptInvitation"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=acceptInvitation&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "close"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=close&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "progress"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=progress&{PARAMS}"
                                  }
                                }
                              ]
                            },
                            {
                              VideoClicks: [
                                {
                                  ClickTracking: {
                                    _cdata: "{ADSERVER}/ev?event=click&{PARAMS}"
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];
    } else if (
      data.flight.demand_source_type === "third_party" &&
      data.flight.is_vast_only
    ) {
      obj.VAST = [
        {
          _attr: {
            version: "3.0"
          }
        },
        {
          Ad: [
            {
              _attr: {
                id: `${data.flight.id}${data.flight.campaignId}`
              }
            },
            {
              Wrapper: [
                {
                  AdSystem: [
                    {
                      _attr: {
                        version: "1.0"
                      }
                    },
                    "PILOTX"
                  ]
                },
                {
                  VASTAdTagURI: {
                    _cdata: `${data.video.js_tag}`
                  }
                },
                {
                  Error: {
                    _cdata: "{ADSERVER}//err?err=[ERRORCODE]&{PARAMS}"
                  }
                },
                {
                  Impression: {
                    _cdata: "{ADSERVER}/imp?{PARAMS}"
                  }
                },
                {
                  Creatives: [
                    {
                      Creative: [
                        {
                          Linear: [
                            isSkippable !=='00:00:00' ?{
                              _attr: {
                                skipoffset:`${isSkippable}`
                              }
                            }:'', 
                            {
                              TrackingEvents: [
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "creativeView"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=creativeView&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "skip"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=skip&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "start"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=start&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "firstQuartile"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=firstQuartile&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "midpoint"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=midpoint&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "thirdQuartile"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=thirdQuartile&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "complete"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=complete&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "mute"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=mute&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "unmute"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=unmute&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "pause"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=pause&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "rewind"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=rewind&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "resume"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=resume&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "fullscreen"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=fullscreen&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "exitFullscreen"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=exitFullScreen&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "expand"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=expand&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "collapse"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=collapse&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "acceptInvitation"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=acceptInvitation&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "close"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=close&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "progress"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=progress&{PARAMS}"
                                  }
                                }
                              ]
                            },
                            {
                              VideoClicks: [
                                {
                                  ClickTracking: {
                                    _cdata: "{ADSERVER}/ev?event=click&{PARAMS}"
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];
    } else if (
      data.flight.demand_source_type === "first_party" &&
      !data.flight.is_vast_only
    ) {
      obj.VAST = [
        {
          _attr: {
            version: "3.0"
          }
        },
        {
          Ad: [
            {
              _attr: {
                id: `${data.flight.id}${data.flight.campaignId}`
              }
            },
            {
              InLine: [
                {
                  AdSystem: [
                    {
                      _attr: {
                        version: "1.0"
                      }
                    },
                    "PILOTX"
                  ]
                },
                {
                  AdTitle: "BWAWF"
                },
                {
                  Survey: {
                    _cdata: "{ADSERVER}/surv?{PARAMS}"
                  }
                },
                {
                  Advertiser: advertiser_id
                },
                {
                  Error: {
                    _cdata: "{ADSERVER}//err?err=[ERRORCODE]&{PARAMS}"
                  }
                },
                {
                  Impression: {
                    _cdata: "{ADSERVER}/imp?{PARAMS}"
                  }
                },
                {
                  Creatives: [
                    {
                      Creative: [
                        {
                          Linear: [
                            isSkippable !=='00:00:00' ?{
                              _attr: {
                                skipoffset:`${isSkippable}`
                              }
                            }:'',       
                            {
                              AdParameters: {
                                _cdata: JSON.stringify({
                                  vid: {
                                    url: `${creativeDomain}/${data.video.filename}`,
                                    mimetype: data.video.content_type,
                                    width: data.video.width.toString(),
                                    height: data.video.height.toString(),
                                    bitrate: data.video.bitrate.toString(),
                                    duration: data.video.duration.toString()

                                  }
                                })
                              }

                            },
                            {
                              Duration: {
                                _cdata: `00:00:${data.video.duration}`
                              }
                            },
                            {
                              MediaFiles: [
                                {
                                  MediaFile: {
                                    _attr: {
                                      id: `0`,
                                      delivery: "progressive",
                                      type: `application/javascript`,
                                      width: `${data.flight.width}`,
                                      height: `${data.flight.height}`,
                                      apiFramework: "VPAID"
                                    },
                                    _cdata:
                                      process.env.NODE_ENV == "development" ||
                                      !process.env.NODE_ENV
                                        ? `http://www.bwacdn.com/vpaid.js`
                                        : `https://cdn.pilotx.tv/vpaid.js`
                                  }
                                }
                              ]
                            },
                            data.flight.channel !=='desktop' ?       {
                              Extensions: [
                            {
                              Extension: [
                            
                            {
                              CustomTracking: [
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "skip"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=skip&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "engagedView"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=engagedView&{PARAMS}"
                                  }
                                }

                              ]
                            }
                          ]
                        }
                      ]
                    }: {
                      Extensions: {
                        _cdata: ""
                      }
                    },
                            {
                              TrackingEvents: [
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "creativeView"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=creativeView&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "skip"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=skip&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "start"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=start&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "firstQuartile"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=firstQuartile&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "midpoint"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=midpoint&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "thirdQuartile"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=thirdQuartile&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "complete"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=complete&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "mute"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=mute&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "unmute"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=unmute&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "pause"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=pause&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "rewind"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=rewind&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "resume"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=resume&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "fullscreen"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=fullscreen&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "exitFullscreen"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=exitFullScreen&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "expand"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=expand&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "collapse"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=collapse&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "acceptInvitation"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=acceptInvitation&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "close"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=close&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "progress"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=progress&{PARAMS}"
                                  }
                                }
                              ]
                            },
                            {
                              VideoClicks: [
                                {
                                  ClickThrough: {
                                    _cdata: data.flight.clickthrough_url
                                  }
                                },
                                {
                                  ClickTracking: {
                                    _cdata: "{ADSERVER}/ev?event=click&{PARAMS}"
                                  }
                                },
                                {
                                  ClickTracking: {
                                    _cdata: data.flight.click_tracker
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
                
              ]
            }
          ]
        }
      ];
    } else if (
      (data.flight.demand_source_type === "third_party" ||
        data.flight.demand_source_type === "rtb") &&
      !data.flight.is_vast_only
    ) {
      var vast_tag_url;
      if (data.flight.demand_source_type === "rtb") {
        // tagURL =  '{ADSERVER}/rtb?{PARAMS}';
        vast_tag_url = "{ADSERVER}/rtb?{PARAMS}";
      } else {
        // tagURL =  `${data.video.js_tag}`;
        vast_tag_url = `${data.video.js_tag}`;
      }

      obj.VAST = [
        {
          _attr: {
            version: "3.0"
          }
        },
        {
          Ad: [
            {
              _attr: {
                id: `${data.flight.id}${data.flight.campaignId}`
              }
            },
            {
              Wrapper: [
                {
                  AdSystem: [
                    {
                      _attr: {
                        version: "1.0"
                      }
                    },
                    "PILOTX"
                  ]
                },
                {
                  VASTAdTagURI: {
                    _cdata: vast_tag_url
                  }
                },
                {
                  Error: {
                    _cdata: "{ADSERVER}//err?err=[ERRORCODE]&{PARAMS}"
                  }
                },
                {
                  Impression: {
                    _cdata: "{ADSERVER}/imp?{PARAMS}"
                  }
                },
                {
                  Creatives: [
                    {
                      Creative: [
                        {
                          Linear: [
                            isSkippable !=='00:00:00' ?{
                              _attr: {
                                skipoffset:`${isSkippable}`
                              }
                            }:'',
                            {
                              TrackingEvents: [
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "creativeView"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=creativeView&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "skip"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=skip&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "start"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=start&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "firstQuartile"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=firstQuartile&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "midpoint"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=midpoint&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "thirdQuartile"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=thirdQuartile&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "complete"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=complete&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "mute"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=mute&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "unmute"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=unmute&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "pause"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=pause&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "rewind"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=rewind&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "resume"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=resume&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "fullscreen"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=fullscreen&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "exitFullscreen"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=exitFullScreen&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "expand"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=expand&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "collapse"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=collapse&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "acceptInvitation"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=acceptInvitation&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "close"
                                    },
                                    _cdata: "{ADSERVER}/ev?event=close&{PARAMS}"
                                  }
                                },
                                {
                                  Tracking: {
                                    _attr: {
                                      event: "progress"
                                    },
                                    _cdata:
                                      "{ADSERVER}/ev?event=progress&{PARAMS}"
                                  }
                                }
                              ]
                            },
                            {
                              VideoClicks: [
                                {
                                  ClickThrough: {
                                    _cdata: data.flight.clickthrough_url
                                  }
                                },
                                {
                                  ClickTracking: {
                                    _cdata: "{ADSERVER}/ev?event=click&{PARAMS}"
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];
    }

    const generatedXML = xml(obj);
    // console.log("Generated xml", generatedXML.toString())
    return generatedXML.toString();
  } else {
    return "";
  }
}

/**
 * Generating ad parameters object for wrapped VAST
 * @param data - data that was sent by the user
 * @param daid
 * @param adid
 * @returns {string}
 */
function generateWrapperVast(data, daid, adid) {
  let creativeDomain;
  if (process.env.NODE_ENV == "development" || !process.env.NODE_ENV) {
    creativeDomain = `http://video.bwacdn.com/${data.flight.id}`;
  } else {
    creativeDomain = `https://video.pilotxcdn.com/${data.flight.id}`;
  }
  //  if (data.flight.format === "video" && data.flight.demand_source_type !== "rtb") {
  if (data.flight.format === "video") {
    const obj = {
      fdata: "{FDATA}",
      fid: "{FID}",
      muted: data.flight.is_muted_allowed.toString(),
      vw: data.flight.is_visible_only.toString(),
      vs: data.flight.is_visible_only.toString(),
      ps: data.flight.player_size,
      click: data.flight.clickthrough_url,
      // New fields below
      crid: "{CREATIVEID}",
      adid: adid.toString(),
      campaignid: data.flight.campaignId.toString(),
      exid: "{EXCHANGEID}",
      buytype: "{BUYTYPE}",
      bundleid: "{BUNDLEID}",
      mediatype: "{MEDIATYPE}"
    };

    if (data.flight.demand_source_type === "first_party") {
      obj.vid = {
        url: `${creativeDomain}/${data.video.filename}`,
        mimetype: data.video.content_type,
        width: data.video.width.toString(),
        height: data.video.height.toString(),
        bitrate: data.video.bitrate.toString(),
        duration: data.video.duration.toString()
      };
    } else if (data.flight.demand_source_type === "third_party") {
      obj.url = data.video.js_tag;
    } else if (data.flight.demand_source_type === "rtb") {
      obj.rtb = "1";
      obj.url = "{ADSERVER}/rtb?{PARAMS}";
    }

    return JSON.stringify(obj);
  } else {
    return "";
  }
}

/**
 * Creatives deletion from CDN
 * @param fileName
 * @param type
 * @returns {Promise.<boolean>}
 */

async function deleteCreativesFromCDN(fileName, type) {
  try {
    if (type === "video") {
      let sftp1 = new Client();
      await sftp1
        .connect({
          host: "cdn.anthemx.tv",
          username: "ec2-user",
          privateKey: fs.readFileSync("./keys/persistence.pem")
        })
        .then(() => {
          return sftp1.delete(`/var/www/html/assets/cdn/video/${fileName}`);
        });

      let sftp2 = new Client();
      await sftp2
        .connect({
          host: "push-18.cdn77.com",
          username: "user_xr3250rh",
          password: "Lozo79BOZquBxp4HDDeS"
        })
        .then(() => {
          return sftp2.delete(`/www/${fileName}`);
        });
    } else if (type === "display") {
      let sftp1 = new Client();
      await sftp1
        .connect({
          host: "cdn.anthemx.tv",
          username: "ec2-user",
          privateKey: fs.readFileSync("./keys/persistence.pem")
        })
        .then(() => {
          return sftp1.delete(`/var/www/html/assets/cdn/display/${fileName}`);
        });

      let sftp2 = new Client();
      await sftp2
        .connect({
          host: "push-18.cdn77.com",
          username: "user_pzn50404",
          password: "sYy56gy556bxz6yj9sYl"
        })
        .then(() => {
          return sftp2.delete(`/www/${fileName}`);
        });
    }
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Flight update async function
 * @param data - the flight data sent by user
 * @param flight - current flight data to be updated
 * @param user - user data
 * @returns {Promise.<boolean>} - after updating all the flight params in various tables
 */
async function updateFlight(data, flight, user) {
  try {
    // Updating creatives
    // First party video flights
    if (
      flight.format === "video" &&
      flight.demand_source_type === "first_party"
    ) {
      console.log('reading 1');
      await saveVideoWithId('update', data.video.filename, flight.id)
      if (
        data.flight.demand_source_type === "first_party" &&
        data.flight.format === "video" &&
        data.video.id === flight.video_creatives[0].id
      ) {
        flight.video_creatives[0].name = data.video.name;
        flight.video_creatives[0].notes = data.video.notes;
        flight.video_creatives[0].alt_text = data.video.alt_text;
        flight.video_creatives[0].filename = data.video.filename;
        flight.video_creatives[0].duration= data.video.duration;
        await flight.video_creatives[0].save();
        // CHECK AND UPDATE COMPANIONS
      } else {
        const fileName = flight.video_creatives[0].filename;
        await models.video_creatives
          .findAll({
            where: {
              filename: fileName
            }
          })
          .then(results => {
            if (results.length === 2) {
              return deleteCreativesFromCDN(fileName, "video");
            }
          });
        await flight.video_creatives[0].destroy();
        if (
          data.flight.format === "video" &&
          data.flight.demand_source_type !== "rtb"
        ) {
          await models.video_creatives.create({
            created_at: moment()
              .utc()
              .unix(),
            name: data.video.name,
            notes: data.video.notes,
            filename: data.video.filename,
            alt_text: data.video.alt_text,
            party: data.video.party,
            js_tag: data.video.js_tag,
            width: data.video.width,
            content_type: data.video.content_type,
            bitrate: data.video.bitrate,
            duration: data.video.duration,
            height: data.video.height,
            zone_id: flight.zone_id,
            account_id: flight.account_id,
            advertiser_id: flight.advertiser_id,
            campaign_id: flight.campaign_id,
            flight_id: flight.id
          });
          if (data.flight.demand_source_type === "first_party") {
            // CHECK AND UPDATE COMPANIONS
          }
        } else {
          // REMOVE COMPANIONS
          if (
            data.flight.format === "display" &&
            data.flight.demand_source_type !== "rtb"
          ) {
            await models.display_creatives.create({
              created_at: moment()
                .utc()
                .unix(),
              name: data.display.name,
              notes: data.display.notes,
              is_companion_creative: false,
              filename: data.display.filename,
              alt_text: data.display.alt_text,
              party: data.display.party,
              js_tag: data.display.js_tag,
              width: data.display.width,
              height: data.display.height,
              zone_id: flight.zone_id,
              account_id: flight.account_id,
              advertiser_id: flight.advertiser_id,
              campaign_id: flight.campaign_id,
              flight_id: flight.id,
              video_creative_id: null
            });
          }
        }
      }
    }
    // Third party video flights
    else if (
      flight.format === "video" &&
      flight.demand_source_type === "third_party"
    ) {
      console.log('reading 2');
      if (
        data.flight.format === "video" &&
        data.flight.demand_source_type === "third_party"
      ) {
        flight.video_creatives[0].name = data.video.name;
        flight.video_creatives[0].notes = data.video.notes;
        flight.video_creatives[0].filename = data.video.filename;
        flight.video_creatives[0].alt_text = data.video.alt_text;
        flight.video_creatives[0].party = data.video.party;
        flight.video_creatives[0].js_tag = data.video.js_tag;
        flight.video_creatives[0].width = data.video.width;
        flight.video_creatives[0].height = data.video.height;
        flight.video_creatives[0].content_type = data.video.content_type;
        flight.video_creatives[0].bitrate = data.video.bitrate;
        flight.video_creatives[0].duration = data.video.duration;
        await flight.video_creatives[0].save();
      } else {
        await await flight.video_creatives[0].destroy();
        if (
          data.flight.format === "display" &&
          data.flight.demand_source_type !== "rtb"
        ) {
          await models.display_creatives.create({
            created_at: moment()
              .utc()
              .unix(),
            name: data.display.name,
            notes: data.display.notes,
            is_companion_creative: false,
            filename: data.display.filename,
            alt_text: data.display.alt_text,
            party: data.display.party,
            js_tag: data.display.js_tag,
            width: data.display.width,
            height: data.display.height,
            zone_id: flight.zone_id,
            account_id: flight.account_id,
            advertiser_id: flight.advertiser_id,
            campaign_id: flight.campaign_id,
            flight_id: flight.id,
            video_creative_id: null
          });
        } else if (
          data.flight.format === "video" &&
          data.flight.demand_source_type === "first_party"
        ) {
          await models.video_creatives.create({
            created_at: moment()
              .utc()
              .unix(),
            name: data.video.name,
            notes: data.video.notes,
            filename: data.video.filename,
            alt_text: data.video.alt_text,
            party: data.video.party,
            js_tag: data.video.js_tag,
            width: data.video.width,
            height: data.video.height,
            content_type: data.video.content_type,
            bitrate: data.video.bitrate,
            duration: data.video.duration,
            zone_id: flight.zone_id,
            account_id: flight.account_id,
            advertiser_id: flight.advertiser_id,
            campaign_id: flight.campaign_id,
            flight_id: flight.id
          });
          // CREATE COMPANIONS
        }
      }
    }
    // RTB flights
    else if (flight.demand_source_type === "rtb") {
      console.log('reading 3');
      if (
        data.flight.format === "video" &&
        data.flight.demand_source_type !== "rtb"
      ) {
        await models.video_creatives.create({
          created_at: moment()
            .utc()
            .unix(),
          name: data.video.name,
          notes: data.video.notes,
          filename: data.video.filename,
          alt_text: data.video.alt_text,
          party: data.video.party,
          js_tag: data.video.js_tag,
          width: data.video.width,
          height: data.video.height,
          content_type: data.video.content_type,
          bitrate: data.video.bitrate,
          duration: data.video.duration,
          zone_id: flight.zone_id,
          account_id: flight.account_id,
          advertiser_id: flight.advertiser_id,
          campaign_id: flight.campaign_id,
          flight_id: flight.id
        });
        if (data.flight.demand_source_type === "first_party") {
          // CREATE COMPANIONS
        }
      } else if (
        data.flight.format === "display" &&
        data.flight.demand_source_type !== "rtb"
      ) {
        await saveDisplayWithId('update', data.display.filename, flight.id)
        await models.display_creatives.create({
          created_at: moment()
            .utc()
            .unix(),
          name: data.display.name,
          notes: data.display.notes,
          is_companion_creative: false,
          filename: data.display.filename,
          alt_text: data.display.alt_text,
          party: data.display.party,
          js_tag: data.display.js_tag,
          width: data.display.width,
          height: data.display.height,
          zone_id: flight.zone_id,
          account_id: flight.account_id,
          advertiser_id: flight.advertiser_id,
          campaign_id: flight.campaign_id,
          flight_id: flight.id,
          video_creative_id: null
        });
      }
    }
    // First party display flights
    else if (
      flight.format === "display" &&
      flight.demand_source_type === "first_party"
    ) {
      console.log('reading 4');
      await saveDisplayWithId('update', data.display.filename, flight.id)
      if (
        data.flight.format === "display" &&
        data.flight.demand_source_type === "first_party" &&
        data.display.id === flight.display_creatives[0].id
      ) 
      
      {
        flight.display_creatives[0].name = data.display.name;
        flight.display_creatives[0].notes = data.display.notes;
        flight.display_creatives[0].alt_text = data.display.alt_text;
        flight.display_creatives[0].filename = data.display.filename;
        await flight.display_creatives[0].save();
      } else {
        const fileName = flight.display_creatives[0].filename;
        await models.video_creatives
          .findAll({
            where: {
              filename: fileName
            }
          })
          .then(results => {
            if (results.length === 2) {
              return deleteCreativesFromCDN(fileName, "display");
            }
          });
        await flight.display_creatives[0].destroy();
        if (
          data.flight.format === "display" &&
          data.flight.demand_source_type !== "rtb"
        ) {
          await models.display_creatives.create({
            created_at: moment()
              .utc()
              .unix(),
            name: data.display.name,
            notes: data.display.notes,
            is_companion_creative: false,
            filename: data.display.filename,
            alt_text: data.display.alt_text,
            party: data.display.party,
            js_tag: data.display.js_tag,
            width: data.display.width,
            height: data.display.height,
            zone_id: flight.zone_id,
            account_id: flight.account_id,
            advertiser_id: flight.advertiser_id,
            campaign_id: flight.campaign_id,
            flight_id: flight.id,
            video_creative_id: null
          });
        } else if (
          data.flight.format === "video" &&
          data.flight.demand_source_type !== "rtb"
        ) {
          await models.video_creatives.create({
            created_at: moment()
              .utc()
              .unix(),
            name: data.video.name,
            notes: data.video.notes,
            filename: data.video.filename,
            alt_text: data.video.alt_text,
            party: data.video.party,
            js_tag: data.video.js_tag,
            width: data.video.width,
            height: data.video.height,
            content_type: data.video.content_type,
            bitrate: data.video.bitrate,
            duration: data.video.duration,
            zone_id: flight.zone_id,
            account_id: flight.account_id,
            advertiser_id: flight.advertiser_id,
            campaign_id: flight.campaign_id,
            flight_id: flight.id
          });

          

          if (data.flight.demand_source_type === "first_party") {
            // CREATE COMPANIONS
          }
        }
      }
    }
    // Third party display flights
    else if (
      flight.format === "display" &&
      flight.demand_source_type === "third_party"
    ) {
      console.log('reading 5');
      if (
        data.flight.format === "display" &&
        data.flight.demand_source_type === "third_party"
      ) {
        flight.display_creatives[0].name = data.display.name;
        flight.display_creatives[0].notes = data.display.notes;
        flight.display_creatives[0].filename = data.display.filename;
        flight.display_creatives[0].alt_text = data.display.alt_text;
        flight.display_creatives[0].party = data.display.party;
        flight.display_creatives[0].js_tag = data.display.js_tag;
        flight.display_creatives[0].width = data.display.width;
        flight.display_creatives[0].height = data.display.height;
        await flight.display_creatives[0].save();
      } else {
        await flight.display_creatives[0].destroy();
        if (
          data.flight.format === "display" &&
          data.flight.demand_source_type === "first_party"
        ) {
          await models.display_creatives.create({
            created_at: moment()
              .utc()
              .unix(),
            name: data.display.name,
            notes: data.display.notes,
            is_companion_creative: false,
            filename: data.display.filename,
            alt_text: data.display.alt_text,
            party: data.display.party,
            js_tag: data.display.js_tag,
            width: data.display.width,
            height: data.display.height,
            zone_id: flight.zone_id,
            account_id: flight.account_id,
            advertiser_id: flight.advertiser_id,
            campaign_id: flight.campaign_id,
            flight_id: flight.id,
            video_creative_id: null
          });
        } else if (
          data.flight.format === "video" &&
          data.flight.demand_source_type !== "rtb"
        ) {
          await models.video_creatives.create({
            created_at: moment()
              .utc()
              .unix(),
            name: data.video.name,
            notes: data.video.notes,
            filename: data.video.filename,
            alt_text: data.video.alt_text,
            party: data.video.party,
            js_tag: data.video.js_tag,
            width: data.video.width,
            height: data.video.height,
            content_type: data.video.content_type,
            bitrate: data.video.bitrate,
            duration: data.video.duration,
            zone_id: flight.zone_id,
            account_id: flight.account_id,
            advertiser_id: flight.advertiser_id,
            campaign_id: flight.campaign_id,
            flight_id: flight.id
          });
          if (data.flight.demand_source_type === "first_party") {
            // CREATE COMPANIONS
          }
        }
      }
    }

    flight.name = data.flight.name;
    flight.notes = data.flight.notes;
    flight.cpm = data.flight.cpm;
    flight.flight_type = data.flight.flight_type;
    flight.cpc = data.flight.cpc;
    flight.clickthrough_url = data.flight.clickthrough_url;
    flight.is_skippable = data.flight.is_skippable;
    flight.click_tracker = data.flight.click_tracker;
    flight.is_retargeted = data.flight.is_retargeted;
    flight.impression_tracker = data.flight.impression_tracker;
    flight.wrapper_url = data.flight.wrapper_url;
    flight.wrapper_source_platform = data.flight.wrapper_source_platform;
    flight.is_direct_deal = data.flight.is_direct_deal;
    flight.direct_deal_ids = [];
    flight.user_frequency_cap = data.flight.user_frequency_cap;
    flight.domain_list_category = data.flight.domain_list_category;
    flight.domain_list_id = data.flight.domain_list_id;
    flight.is_muted_allowed = data.flight.is_muted_allowed;
    flight.is_visible_only = data.flight.is_visible_only;
    flight.start_time = data.flight.start_time;
    flight.end_time = data.flight.end_time;
    flight.demand_source_type = data.flight.demand_source_type;
    flight.pacing_category = data.flight.pacing_category;
    flight.user_agent = data.flight.user_agent;
    flight.desktop_browser_targeting = data.flight.desktop_browser_targeting;
    flight.rtb_source = data.flight.rtb_source;

    flight.deal_id = data.flight.deal_id;
    flight.deal_cpmfloor = data.flight.deal_cpmfloor;

    flight.format = data.flight.format;
    flight.max_video_duration = data.flight.maxVideoDuration;
    flight.channel = data.flight.channel;
    flight.vast_document = generateVastDocument(data);
    flight.wrapper_vast = generateWrapperVast(
      data,
      user.scope_account_id,
      flight.advertiser_id
    );
    flight.timezone = data.flight.timezone;
    flight.status = data.flight.status;
    flight.height = data.flight.height;
    flight.width = data.flight.width;
    flight.player_size = data.flight.player_size;
    flight.is_vast_only = data.flight.is_vast_only;
    flight.iab_categories = data.flight.iab_categories;
    await flight.save();

    if (!flight.flight_brand_safety_providers[0]) {
      for (let i = 0; i < data.brandSafety.length; i++) {
        const item = {
          name: data.brandSafety[i].name,
          is_active: data.brandSafety[i].is_active,
          flight_id: createdFlight.id
        };
        await models.flight_brand_safety_providers.create(item);
      }
    } else {
          // Updating brand safety
    let arr = data.brandSafety;
    arr.sort(function(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    for (let i = 0; i < arr.length; i++) {
      flight.flight_brand_safety_providers[i].is_active = arr[i].is_active;
      await flight.flight_brand_safety_providers[i].save();
    }
    }



    // Updating day partings
    if (flight.flight_day_partings.length || data.dayParting.length) {
      let destroy = [];
      destroy.length = flight.flight_day_partings.length;
      destroy.fill(true);
      // Create day parting
      for (let i = 0; i < data.dayParting.length; i++) {
        if (data.dayParting[i].id === 0) {
          await models.flight_day_partings.create({
            start_day: data.dayParting[i].start_day,
            end_day: data.dayParting[i].end_day,
            start_hour: data.dayParting[i].start_hour,
            end_hour: data.dayParting[i].end_hour,
            flight_id: flight.id
          });
        } else {
          for (let j = 0; j < flight.flight_day_partings.length; j++) {
            if (data.dayParting[i].id === flight.flight_day_partings[j].id) {
              flight.flight_day_partings[j].start_day =
                data.dayParting[i].start_day;
              flight.flight_day_partings[j].end_day =
                data.dayParting[i].end_day;
              flight.flight_day_partings[j].start_hour =
                data.dayParting[i].start_hour;
              flight.flight_day_partings[j].end_hour =
                data.dayParting[i].end_hour;
              destroy[j] = false;
              await flight.flight_day_partings[j].save();
            }
          }
        }
      }
      for (let i = 0; i < flight.flight_day_partings.length; i++) {
        if (destroy[i]) {
          await flight.flight_day_partings[i].destroy();
        }
      }
    }
    // Updating geo targets
    // if (flight.flight_geo_targets.length || data.geo.length) {
    //   let destroy = [];
    //   destroy.length = flight.flight_geo_targets.length;
    //   destroy.fill(true);
    //   // Create geo
    //   for (let i = 0; i < data.geo.length; i++) {
    //     if (data.geo[i].id === 0) {
    //       await models.flight_geo_targets.create({
    //         is_include: data.geo[i].is_include,
    //         country: data.geo[i].country,
    //         province: data.geo[i].province,
    //         city: date.geo[i].city,
    //         dma: data.geo[i].dma,
    //         postal_code: data.geo[i].dma,
    //         flight_id: flight.id
    //       });
    //     }
    //     else {
    //       for (let j = 0; j < flight.flight_geo_targets.length; j++) {
    //         if (data.geo[i].id === flight.flight_geo_targets[j].id) {
    //           flight.flight_geo_targets[j].country = data.geo[i].country;
    //           flight.flight_geo_targets[j].province = data.geo[i].province;
    //           flight.flight_geo_targets[j].city = data.geo[i].city;
    //           flight.flight_geo_targets[j].dma = data.geo[i].dma;
    //           flight.flight_geo_targets[j].postal_code = data.geo[i].postal_code;
    //           destroy[j] = false;
    //           await flight.flight_geo_targets[j].save();
    //         }
    //       }
    //     }
    //   }
    //   for (let i = 0; i < flight.flight_geo_targets.length; i++) {
    //     if (destroy[i]) {
    //       await flight.flight_geo_targets[i].destroy();
    //     }
    //   }
    // }
    let destroy = [];
    let create = [];
    destroy.length = flight.flight_geo_targets.length;
    destroy.fill(true);
    create.length = data.targetGeo.length;
    create.fill(true);
    for (let i = 0; i < flight.flight_geo_targets.length; i++) {
      for (let j = 0; j < data.targetGeo.length; j++) {
        if (
          flight.flight_geo_targets[i][data.targetGeo[j].type] ===
            data.targetGeo[j].value &&
          flight.flight_geo_targets[i].is_include ===
            data.targetGeo[j].is_include
        ) {
          destroy[i] = false;
          create[j] = false;
        }
      }
    }
    // Create new geos
    for (let i = 0; i < data.targetGeo.length; i++) {
      if (create[i]) {
        await models.flight_geo_targets.create({
          is_include: data.targetGeo[i].is_include,
          country:
            data.targetGeo[i].type === "country" ? data.targetGeo[i].value : "",
          province:
            data.targetGeo[i].type === "province"
              ? data.targetGeo[i].value
              : "",
          city:
            data.targetGeo[i].type === "city" ? data.targetGeo[i].value : "",
          dma: data.targetGeo[i].type === "dma" ? data.targetGeo[i].value : "",
          postal_code:
            data.targetGeo[i].type === "postal_code"
              ? data.targetGeo[i].value
              : "",
          flight_id: flight.id
        });
      }
    }
    // Delete geos
    for (let i = 0; i < flight.flight_geo_targets.length; i++) {
      if (destroy[i]) {
        await flight.flight_geo_targets[i].destroy();
      }
    }
    // Updating flight goals
    if (flight.flight_goals.length || data.goals.length) {
      let destroy = [true, true];
      for (let i = 0; i < data.goals.length; i++) {
        if (data.goals[i].id === 0) {
          await models.flight_goals.create({
            impressions: data.goals[i].impressions,
            interval: data.goals[i].interval,
            flight_id: flight.id,
            is_budget: data.goals[i].is_budget,
            current_impression_count: 0
          });
        } else {
          for (let j = 0; j < flight.flight_goals.length; j++) {
            if (data.goals[i].id === flight.flight_goals[j].id) {
              flight.flight_goals[j].impressions = data.goals[i].impressions;
              flight.flight_goals[j].interval = data.goals[i].interval;
              flight.flight_goals[j].is_budget = data.goals[i].is_budget;
              destroy[j] = false;
              await flight.flight_goals[j].save();
            }
          }
        }
      }
      for (let i = 0; i < flight.flight_goals.length; i++) {
        if (destroy[i]) {
          await flight.flight_goals[i].destroy();
        }
      }
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Flight creation
exports.create = function(req, res, next) {
  if (utils.isAllowed(req.user, actions.CREATE_FLIGHT, null)) {
    if (validators.flight(req.body)) {
      models.campaigns
        .findOne({ where: { id: req.body.flight.campaignId } })
        .then(campaign => {
          if (
            campaign &&
            utils.isAllowed(req.user, actions.UPDATE_CAMPAIGN, campaign)
          ) {
            return models.flights
              .findOne({
                where: {
                  name: req.body.flight.name,
                  advertiser_id: campaign.advertiser_id
                }
              })
              .then(flight => {
                if (!flight) {
                  return createFlight(req.body, campaign, req.user).then(
                    response => {
                      if (response) {
                        res.sendStatus(200);
                      } else {
                        res
                          .status(503)
                          .send({
                            msg:
                              "Could not create a flight at this moment. Please try again later."
                          });
                      }
                    }
                  );
                } else {
                  res
                    .status(422)
                    .send({
                      msg:
                        "Flight with this name already exists. Please choose a different name"
                    });
                }
              })
              .catch(err => {
                res
                  .status(503)
                  .send({
                    msg:
                      "Could not create a flight at this moment. Please try again later."
                  });
              });
          } else {
            res
              .status(401)
              .send({ msg: "You are not authorized for this operation" });
          }
        })
        .catch(err => {
          res
            .status(503)
            .send({
              msg:
                "Could not create a flight at this moment. Please try again later."
            });
        });
    } else {
      res.status(406).send({ msg: "Invalid input" });
    }
  } else {
    res.status(401).send({ msg: "You are not authorized for this operation" });
  }
};

// Flight deletion
exports.delete = function(req, res, next) {
  if (validators.id(req.body.id)) {
    models.flights
      .findOne({ where: { id: req.body.id } })
      .then(flight => {
        if (flight) {
          if (utils.isAllowed(req.user, actions.DELETE_FLIGHT, flight)) {
            flight.status = "disabled";
            flight.name = `${flight.name} - deleted-${val.generateTime()}`;
            return flight
              .save()
              .then(response => {
                res.sendStatus(200);
              })
              .catch(err => {
                res
                  .status(503)
                  .send({
                    message:
                      "Could not delete the flight at this time. Please try again later"
                  });
              });
          } else {
            res
              .status(401)
              .send({ msg: "You are not permitted to do this operation" });
          }
        } else {
          res
            .status(404)
            .send({
              msg:
                "Could not delete the flight at this time. Please try again later"
            });
        }
      })
      .catch(err => {
        res
          .status(503)
          .send({
            msg:
              "Could not delete the flight at this time. Please try again later"
          });
      });
  } else {
    res
      .status(406)
      .send({
        msg: "Could not delete the flight at this time. Please try again later"
      });
  }
};

// List all flights except disabled
exports.list = function(req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_FLIGHTS, null)) {
    let options = utils.generateOptions(req.body, "flights");
    let dspOptions = utils.generateDspOptions(req.body, [
      "active",
      "inactive",
      "capped",
      "complete",
      "paused",
      "disabled"
    ]);
    //ONLY FOR IFLIGHT
    options.where.status = {
      $or: ["active", "inactive", "capped", "complete", "paused", "disabled"]
    };
    options.where.zone_id = req.user.scope_zone_id;
    console.log("BACKEND MASTER", req.body.master);
    if (
      (!(req.user.role & roles.SUPER_ADMIN) &&
        !(req.user.role & roles.OPS_ADMIN)) ||
      !req.body.master
    ) {
      options.where.account_id = req.user.scope_account_id;
    }
    if (validators.id(req.body.id)) {
      options.where.campaign_id = req.body.id;
    }
    options.attributes = [
      "id",
      "name",
      "created_at",
      "notes",
      "cpm",
      "channel",
      "format",
      "status",
      "start_time",
      "end_time",
      "demand_source_type",
      "is_retargeted"
    ];
    options.include = [
      {
        model: models.advertisers,
        require: true,
        attributes: ["id", "name"]
      },
      {
        model: models.campaigns,
        require: true,
        attributes: ["id", "name"]
      }
    ];

    models.flights
      .count({
        where: options.where
      })
      .then(count => {
        return models.flights
          .findAll(req.body.dsp ? dspOptions : options)
          .then(results => {
            let payload = {};
            payload.rows = results;
            payload.pagination = {
              currentPage: req.body.currentPage || 1,
              limit: req.body.pageChunk || 15,
              totalPages: Math.ceil(count / (req.body.pageChunk || 15))
            };
            res.send(payload);
          })
          .catch(err => {
            res
              .status(503)
              .send({
                message:
                  "Could not display flights at this time. Please try again later 1."
              });
          });
      })
      .catch(err => {
        res
          .status(503)
          .send({
            message:
              "Could not display flights at this time. Please try again later 2."
          });
      });
  } else {
    res.sendStatus(401);
  }
};
// Paused flights
exports.listPaused = function(req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_FLIGHTS, null)) {
    let options = utils.generateOptions(req.body, "flights");
    let dspOptions = utils.generateDspOptions(req.body, ["paused"]);
    options.where.status = "paused";
    options.where.zone_id = req.user.scope_zone_id;
    if (
      (!(req.user.role & roles.SUPER_ADMIN) &&
        !(req.user.role & roles.OPS_ADMIN)) ||
      !req.body.master
    ) {
      options.where.account_id = req.user.scope_account_id;
    }
    if (validators.id(req.body.id)) {
      options.where.campaign_id = req.body.id;
    }
    options.attributes = [
      "id",
      "name",
      "created_at",
      "notes",
      "cpm",
      "channel",
      "format",
      "status",
      "start_time",
      "end_time",
      "demand_source_type",
      "is_retargeted"
    ];
    options.include = [
      {
        model: models.advertisers,
        require: true,
        attributes: ["id", "name"]
      },
      {
        model: models.campaigns,
        require: true,
        attributes: ["id", "name"]
      }
    ];

    models.flights
      .count({
        where: options.where
      })
      .then(count => {
        return models.flights
          .findAll(req.body.dsp ? dspOptions : options)
          .then(results => {
            let payload = {};
            payload.rows = results;
            payload.pagination = {
              currentPage: req.body.currentPage || 1,
              limit: req.body.pageChunk || 15,
              totalPages: Math.ceil(count / (req.body.pageChunk || 15))
            };
            res.send(payload);
          })
          .catch(err => {
            res
              .status(503)
              .send({
                message:
                  "Could not display flights at this time. Please try again later."
              });
          });
      })
      .catch(err => {
        res
          .status(503)
          .send({
            message:
              "Could not display flights at this time. Please try again later."
          });
      });
  } else {
    res.sendStatus(401);
  }
};

// List inactive flights
exports.listInactive = function(req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_FLIGHTS, null)) {
    let options = utils.generateOptions(req.body, "flights");
    let dspOptions = utils.generateDspOptions(req.body, [
      "inactive",
      "capped",
      "complete"
    ]);
    options.where.status = {
      $or: ["inactive", "capped", "complete"]
    };
    options.where.zone_id = req.user.scope_zone_id;
    if (
      (!(req.user.role & roles.SUPER_ADMIN) &&
        !(req.user.role & roles.OPS_ADMIN)) ||
      !req.body.master
    ) {
      options.where.account_id = req.user.scope_account_id;
    }
    if (validators.id(req.body.id)) {
      options.where.campaign_id = req.body.id;
    }
    options.attributes = [
      "id",
      "name",
      "created_at",
      "notes",
      "cpm",
      "channel",
      "format",
      "status",
      "start_time",
      "end_time",
      "demand_source_type",
      "is_retargeted"
    ];
    options.include = [
      {
        model: models.advertisers,
        require: true,
        attributes: ["id", "name"]
      },
      {
        model: models.campaigns,
        require: true,
        attributes: ["id", "name"]
      }
    ];

    models.flights
      .count({
        where: options.where
      })
      .then(count => {
        return models.flights
          .findAll(req.body.dsp ? dspOptions : options)
          .then(results => {
            let payload = {};
            payload.rows = results;
            payload.pagination = {
              currentPage: req.body.currentPage || 1,
              limit: req.body.pageChunk || 15,
              totalPages: Math.ceil(count / (req.body.pageChunk || 15))
            };
            res.send(payload);
          })
          .catch(err => {
            res
              .status(503)
              .send({
                message:
                  "Could not display flights at this time. Please try again later."
              });
          });
      })
      .catch(err => {
        res
          .status(503)
          .send({
            message:
              "Could not display flights at this time. Please try again later."
          });
      });
  } else {
    res.sendStatus(401);
  }
};

// List active flights
exports.listActive = function(req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_FLIGHTS, null)) {
    let options = utils.generateOptions(req.body, "flights");
    let dspOptions = utils.generateDspOptions(req.body, ["active"]);
    options.where.status = "active";
    options.where.zone_id = req.user.scope_zone_id;
    if (
      (!(req.user.role & roles.SUPER_ADMIN) &&
        !(req.user.role & roles.OPS_ADMIN)) ||
      !req.body.master
    ) {
      options.where.account_id = req.user.scope_account_id;
    }
    if (validators.id(req.body.id)) {
      options.where.campaign_id = req.body.id;
    }
    options.attributes = [
      "id",
      "name",
      "created_at",
      "notes",
      "cpm",
      "channel",
      "format",
      "status",
      "start_time",
      "end_time",
      "demand_source_type",
      "is_retargeted"
    ];
    options.include = [
      {
        model: models.advertisers,
        require: true,
        attributes: ["id", "name"]
      },
      {
        model: models.campaigns,
        require: true,
        attributes: ["id", "name"]
      }
    ];

    models.flights
      .count({
        where: options.where
      })
      .then(count => {
        return models.flights
          .findAll(req.body.dsp ? dspOptions : options)
          .then(results => {
            let payload = {};
            payload.rows = results;
            payload.pagination = {
              currentPage: req.body.currentPage || 1,
              limit: req.body.pageChunk || 15,
              totalPages: Math.ceil(count / (req.body.pageChunk || 15))
            };
            res.send(payload);
          })
          .catch(err => {
            res
              .status(503)
              .send({
                message:
                  "Could not display flights at this time. Please try again later."
              });
          });
      })
      .catch(err => {
        res
          .status(503)
          .send({
            message:
              "Could not display flights at this time. Please try again later."
          });
      });
  } else {
    res.sendStatus(401);
  }
};

// List disabled flights
exports.listDisabled = function(req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_DISABLED_FLIGHTS, null)) {
    let options = utils.generateOptions(req.body, "flights");
    let dspOptions = utils.generateDspOptions(req.body, ["disabled"]);
    options.where.status = "disabled";
    options.where.zone_id = req.user.scope_zone_id;
    if (
      (!(req.user.role & roles.SUPER_ADMIN) &&
        !(req.user.role & roles.OPS_ADMIN)) ||
      !req.body.master
    ) {
      options.where.account_id = req.user.scope_account_id;
    }
    if (validators.id(req.body.id)) {
      options.where.campaign_id = req.body.id;
    }
    options.attributes = [
      "id",
      "name",
      "created_at",
      "notes",
      "cpm",
      "channel",
      "format",
      "status",
      "start_time",
      "end_time",
      "demand_source_type",
      "is_retargeted"
    ];
    options.include = [
      {
        model: models.advertisers,
        require: true,
        attributes: ["id", "name"]
      },
      {
        model: models.campaigns,
        require: true,
        attributes: ["id", "name"]
      }
    ];

    models.flights
      .count({
        where: options.where
      })
      .then(count => {
        return models.flights
          .findAll(req.body.dsp ? dspOptions : options)
          .then(results => {
            let payload = {};
            payload.rows = results;
            payload.pagination = {
              currentPage: req.body.currentPage || 1,
              limit: req.body.pageChunk || 15,
              totalPages: Math.ceil(count / (req.body.pageChunk || 15))
            };
            res.send(payload);
          })
          .catch(err => {
            res
              .status(503)
              .send({
                message:
                  "Could not display flights at this time. Please try again later."
              });
          });
      })
      .catch(err => {
        res
          .status(503)
          .send({
            message:
              "Could not display flights at this time. Please try again later."
          });
      });
  } else {
    res.sendStatus(401);
  }
};

// Read a single flight
exports.read = function(req, res, next) {
  if (validators.id(req.body.id)) {
    models.flights
      .findOne({
        where: {
          id: req.body.id
        },
        include: [
          {
            model: models.display_creatives
          },
          {
            model: models.flight_brand_safety_providers
          },
          {
            model: models.flight_day_partings
          },
          {
            model: models.flight_goals
          },
          {
            model: models.flight_geo_targets
          },
          {
            model: models.video_creatives
          },
          {
            model: models.advertisers,
            attributes: ["id", "name"]
          },
          {
            model: models.campaigns,
            attributes: ["id", "name"]
          }
        ]
      })
      .then(flight => {
        // console.log(flight);
        if (flight) {
          if (utils.isAllowed(req.user, actions.READ_FLIGHT, flight)) {
            res.send(flight);
          } else {
            res.sendStatus(401);
          }
        } else {
          res.sendStatus(404);
        }
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(503);
      });
  } else {
    res.sendStatus(406);
  }
};

// Update a flight
exports.update = function(req, res, next) {
  if (validators.flight(req.body, "update")) {
    models.flights
      .findOne({
        where: {
          id: req.body.flight.id
        },
        include: [
          {
            model: models.display_creatives
          },
          {
            model: models.flight_brand_safety_providers,
            order: [["name", "asc"]]
          },
          {
            model: models.flight_day_partings
          },
          {
            model: models.flight_geo_targets
          },
          {
            model: models.flight_goals
          },
          {
            model: models.video_creatives
          }
        ]
      })
      .then(flight => {
        if (flight) {
          if (utils.isAllowed(req.user, actions.UPDATE_FLIGHT, flight)) {
            return updateFlight(req.body, flight, req.user).then(response => {
              if (response) {
                res.sendStatus(200);
              } else {
                res
                  .status(503)
                  .send({
                    msg:
                      "Could not update the flight at this moment. Please try again later 1."
                  });
              }
            });
          } else {
            res
              .status(401)
              .send({ msg: "You are not authorized for this operation" });
          }
        } else {
          res
            .status(404)
            .send({
              msg:
                "Could not update the flight at this moment. Please try again later 2."
            });
        }
      })
      .catch(err => {
        res
          .status(503)
          .send({
            msg:
              "Could not update the flight at this moment. Please try again later 3."
          });
      });
  } else {
    res.status(406).send({ msg: "Your input is invalid" });
  }
};

// Activate flight
exports.activate = function(req, res, next) {
  if (validators.id(req.body.id)) {
    models.flights
      .findOne({ where: { id: req.body.id } })
      .then(flight => {
        if (flight) {
          if (utils.isAllowed(req.user, actions.ACTIVATE_FLIGHT, flight)) {
            flight.status = "active";
            return flight
              .save()
              .then(response => {
                res.sendStatus(200);
              })
              .catch(err => {
                res
                  .status(503)
                  .send({
                    msg:
                      "Could not activate the flight at this time. Please try again later"
                  });
              });
          } else {
            res
              .status(401)
              .send({ msg: "You are not permitted to do this operation" });
          }
        } else {
          res
            .status(404)
            .send({
              msg:
                "Could not activate the flight at this time. Please try again later"
            });
        }
      })
      .catch(err => {
        res
          .status(503)
          .send({
            msg:
              "Could not activate the flight at this time. Please try again later"
          });
      });
  } else {
    res
      .status(406)
      .send({
        msg:
          "Could not activate the flight at this time. Please try again later"
      });
  }
};

// Deactivate flight
exports.deactivate = function(req, res, next) {
  if (validators.id(req.body.id)) {
    models.flights
      .findOne({ where: { id: req.body.id } })
      .then(flight => {
        if (flight) {
          if (utils.isAllowed(req.user, actions.DEACTIVATE_FLIGHT, flight)) {
            flight.status = "inactive";
            return flight
              .save()
              .then(response => {
                res.sendStatus(200);
              })
              .catch(err => {
                res
                  .status(503)
                  .send({
                    msg:
                      "Could not deactivate the flight at this time. Please try again later"
                  });
              });
          } else {
            res
              .status(401)
              .send({ msg: "You are not permitted to do this operation" });
          }
        } else {
          res
            .status(404)
            .send({
              msg:
                "Could not deactivate the flight at this time. Please try again later"
            });
        }
      })
      .catch(err => {
        res
          .status(503)
          .send({
            msg:
              "Could not deactivate the flight at this time. Please try again later"
          });
      });
  } else {
    res
      .status(406)
      .send({
        msg:
          "Could not deactivate the flight at this time. Please try again later"
      });
  }
};

//Pause Flight
exports.pause = function(req, res, next) {
  if (validators.id(req.body.id)) {
    models.flights
      .findOne({ where: { id: req.body.id } })
      .then(flight => {
        if (flight) {
          if (utils.isAllowed(req.user, actions.DEACTIVATE_FLIGHT, flight)) {
            flight.status = "paused";
            return flight
              .save()
              .then(response => {
                res.sendStatus(200);
              })
              .catch(err => {
                res
                  .status(503)
                  .send({
                    msg:
                      "Could not deactivate the flight at this time. Please try again later"
                  });
              });
          } else {
            res
              .status(401)
              .send({ msg: "You are not permitted to do this operation" });
          }
        } else {
          res
            .status(404)
            .send({
              msg:
                "Could not deactivate the flight at this time. Please try again later"
            });
        }
      })
      .catch(err => {
        res
          .status(503)
          .send({
            msg:
              "Could not deactivate the flight at this time. Please try again later"
          });
      });
  } else {
    res
      .status(406)
      .send({
        msg:
          "Could not deactivate the flight at this time. Please try again later"
      });
  }
};

//Disable flight
//Pause Flight
exports.disable = function(req, res, next) {
  if (validators.id(req.body.id)) {
    models.flights
      .findOne({ where: { id: req.body.id } })
      .then(flight => {
        if (flight) {
          if (utils.isAllowed(req.user, actions.DEACTIVATE_FLIGHT, flight)) {
            flight.status = "disabled";
            return flight
              .save()
              .then(response => {
                res.sendStatus(200);
              })
              .catch(err => {
                res
                  .status(503)
                  .send({
                    msg:
                      "Could not deactivate the flight at this time. Please try again later"
                  });
              });
          } else {
            res
              .status(401)
              .send({ msg: "You are not permitted to do this operation" });
          }
        } else {
          res
            .status(404)
            .send({
              msg:
                "Could not deactivate the flight at this time. Please try again later"
            });
        }
      })
      .catch(err => {
        res
          .status(503)
          .send({
            msg:
              "Could not deactivate the flight at this time. Please try again later"
          });
      });
  } else {
    res
      .status(406)
      .send({
        msg:
          "Could not deactivate the flight at this time. Please try again later"
      });
  }
};
// Clone flight
exports.clone = function(req, res, next) {
  if (utils.isAllowed(req.user, actions.CLONE_FLIGHT, null)) {
    if (validators.flight(req.body, "create")) {
      models.campaigns
        .findOne({ where: { id: req.body.flight.campaignId } })
        .then(campaign => {
          if (
            campaign &&
            utils.isAllowed(req.user, actions.UPDATE_CAMPAIGN, campaign)
          ) {
            return models.flights
              .findOne({
                where: {
                  name: req.body.flight.name,
                  advertiser_id: campaign.advertiser_id
                }
              })
              .then(flight => {
                if (!flight) {
                  return cloneFlight(req.body, campaign, req.user).then(
                    response => {
                      if (response) {
                        res.sendStatus(200);
                      } else {
                        res
                          .status(503)
                          .send({
                            msg:
                              "Could not create a flight at this moment. Please try again later."
                          });
                      }
                    }
                  );
                } else {
                  res
                    .status(422)
                    .send({
                      msg:
                        "Flight with this name already exists. Please choose a different name"
                    });
                }
              })
              .catch(err => {
                res
                  .status(503)
                  .send({
                    msg:
                      "Could not create a flight at this moment. Please try again later."
                  });
              });
          } else {
            res
              .status(401)
              .send({ msg: "You are not authorized for this operation" });
          }
        })
        .catch(err => {
          res
            .status(503)
            .send({
              msg:
                "Could not create a flight at this moment. Please try again later."
            });
        });
    } else {
      res.status(406).send({ msg: "Invalid input" });
    }
  } else {
    res.status(401).send({ msg: "You are not authorized for this operation" });
  }
};

// Display creative upload
exports.displayUpload = function(req, res, next) {
  if (utils.isAllowed(req.user, actions.UPLOAD_CREATIVES, null)) {
    const name = shortid.generate();
    let suffix = "";
    switch (req.files.upload_file.type) {
      case "image/jpeg":
        suffix = "jpg";
        break;
      case "image/png":
        suffix = "png";
        break;
      case "image/gif":
        suffix = "gif";
        break;
    }
    console.log(`${name} ${suffix}`);
    syncDisplayToCDN(name, suffix, req.files.upload_file.path).then(
      response => {
        if (response) {
          ffprobe(
            req.files.upload_file.path,
            { path: ffprobeStatic.path },
            function(err, info) {
              if (err) res.sendStatus(503);
              const payload = {
                fileName: `${name}.${suffix}`,
                width: info.streams[0].width,
                height: info.streams[0].height
              };
              res.send(payload);
            }
          );
        } else {
          res.sendStatus(503);
        }
      }
    );
  } else {
    res.sendStatus(401);
  }
};

// Video creative upload
exports.videoUpload = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.UPLOAD_CREATIVES, null)) {
    const name = shortid.generate();
    let suffix = "";
    switch (req.files.upload_file.type) {
      case "video/mp4":
        suffix = "mp4";
        break;
      case "video/x-flv":
        suffix = "flv";
        break;
      case "video/avi":
        suffix = "avi";
        break;
      case "video/quicktime":
        suffix = "mov";
        break;
    }
    syncVideoToCDN(name, suffix, req.files.upload_file.path)
      .then(response => {
        if (response) {
          ffprobe(req.files.upload_file.path, { path: ffprobeStatic.path }, function (err, info) {
            if (err) res.sendStatus(503);
            const payload = {
              fileName: `${name}.${suffix}`,
              height: info.streams[0].height,
              width: info.streams[0].width,
              bitrate: Number(info.streams[0].bit_rate),
              duration: Math.ceil(Number(info.streams[0].duration)),
              contentType: req.files.upload_file.type
            };
            shell.rm('-rf', req.files.upload_file.path);
            res.send(payload);
          })
        }
        else {
          res.sendStatus(503);
        }
      });
  }
  else {
    res.sendStatus(401);
  }
};

// Upload video files to CDN
async function syncVideoToCDN(name, suffix, path) {
  try {
    let sftp1 = new Client();
    if (process.env.NODE_ENV == 'development' || !process.env.NODE_ENV) {
      console.log('GOT TO DEVELOPMENT')
      await sftp1.connect({
        host: 'cdn.bwaserver.com',
        username: 'ubuntu',
        privateKey: fs.readFileSync('./keys/cdnbox.pem')
      })
        .then(() => {
          return sftp1.put(path, `/var/www/html/assets/cdn/video/${name}.${suffix}`);
        });
    }
    else {
      console.log('GOT TO PRODUCTION')
      await sftp1.connect({
        host: 'cdn.anthemx.tv',
        username: 'ec2-user',
        privateKey: fs.readFileSync('./keys/persistence.pem')
      })
        .then(() => {
          return sftp1.put(path, `/var/www/html/assets/cdn/video/${name}.${suffix}`);
        });
    }
    return true;
  }
  catch (err) {
    console.log(err);
    return false;
  }
}

async function saveVideoWithId(type, name, id, clonedId) {
  try {
    let sftp= new Client();
    let filePath = clonedId ? `/var/www/html/assets/cdn/video/${clonedId}/${name}` : `/var/www/html/assets/cdn/video/${name}`;
    if (process.env.NODE_ENV == 'development' || !process.env.NODE_ENV) {
      console.log('GOT TO DEVELOPMENT')
      await sftp.connect({
        host: 'cdn.bwaserver.com',
        username: 'ubuntu',
        privateKey: fs.readFileSync('./keys/cdnbox.pem')
      })
      .then(() => {
        if (type=='update') {
          return sftp.rename(filePath, `/var/www/html/assets/cdn/video/${id}/${name}`)
          .catch(err=>{
            return saveVideoWithId('reset', name, id, clonedId);
          })
        }
       sftp.mkdir(`/var/www/html/assets/cdn/video/${id}`, true)
       .then(succ=>{
         if (clonedId) {
          console.log('IT IS CLONE')
          sftp.fastGet( `/var/www/html/assets/cdn/video/${clonedId}/${name}`,`${name}` )
          .then(()=>{
            console.log('UPLOADING')
            sftp.fastPut(`${name}`, `/var/www/html/assets/cdn/video/${id}/${name}`)
            .then(()=>{
              console.log('IT IS CLONE FINISHED!');
              shell.rm('-rf', `${name}`);
              console.log('FILE DELETED!');
              return;
            })
          })
          .catch(err=>{
            console.log(err);
            return;
          });
         }
         else{
          console.log('IT IS UPLOADING!');
          return sftp.rename(filePath, `/var/www/html/assets/cdn/video/${id}/${name}`)
         }
       })
       .catch(err=>{
        console.log('folder already exists')
       });
      })
    }
    else {
      console.log('GOT TO PRODUCTION')
      await sftp.connect({
        host: 'cdn.anthemx.tv',
        username: 'ec2-user',
        privateKey: fs.readFileSync('./keys/persistence.pem')
      })
      .then(succ=>{
        if (clonedId) {
         console.log('IT IS CLONE')
         sftp.fastGet( `/var/www/html/assets/cdn/video/${clonedId}/${name}`,`${name}` )
         .then(()=>{
           console.log('UPLOADING')
           sftp.fastPut(`${name}`, `/var/www/html/assets/cdn/video/${id}/${name}`)
           .then(()=>{
             console.log('IT IS CLONE FINISHED!');
             shell.rm('-rf', `${name}`);
             console.log('FILE DELETED!');
             return;
           })
         })
         .catch(err=>{
           console.log(err);
           return;
         });
        }
        else{
         console.log('IT IS UPLOADING!');
         return sftp.rename(filePath, `/var/www/html/assets/cdn/video/${id}/${name}`)
        }
      })
      .catch(err=>{
        console.log('folder already exists')
      });
    }
    return true;
  }
  catch (err) {
    console.log(err);
    return false;
  }
}


async function saveDisplayWithId(type, name, id, clonedId) {
  try {
    let sftp= new Client();
    let filePath = clonedId ? `/var/www/html/assets/cdn/display/${clonedId}/${name}` : `/var/www/html/assets/cdn/display/${name}`;
    if (process.env.NODE_ENV == 'development' || !process.env.NODE_ENV) {
      console.log('GOT TO DEVELOPMENT')
      await sftp.connect({
        host: 'cdn.bwaserver.com',
        username: 'ubuntu',
        privateKey: fs.readFileSync('./keys/cdnbox.pem')
      })
        .then(() => {
          if (type=='update') {
            return sftp.rename(filePath, `/var/www/html/assets/cdn/display/${id}/${name}`)
            .catch(err=>{
              return  saveDisplayWithId('reset', name, id, clonedId);
            })
          }
         sftp.mkdir(`/var/www/html/assets/cdn/display/${id}`, true)
         .then(succ=>{
           if (clonedId) {
            console.log('IT IS CLONE')
            sftp.fastGet( `/var/www/html/assets/cdn/display/${clonedId}/${name}`,`${name}` )
            .then(()=>{
              console.log('UPLOADING')
              sftp.fastPut(`${name}`, `/var/www/html/assets/cdn/display/${id}/${name}`)
              .then(()=>{
                console.log('IT IS CLONE FINISHED!');
                shell.rm('-rf', `${name}`);
                console.log('FILE DELETED!');
                return;
              })
            })
            .catch(err=>{
              console.log(err);
              return;
            });
           }
           else{
            console.log('IT IS UPLOADING!');
            return sftp.rename(filePath, `/var/www/html/assets/cdn/display/${id}/${name}`)
           }
         })
         .catch(err=>{
           console.log('folder already exists')
         });
        })
    }
    else {
      console.log('GOT TO PRODUCTION')
      await sftp.connect({
        host: 'cdn.anthemx.tv',
        username: 'ec2-user',
        privateKey: fs.readFileSync('./keys/persistence.pem')
      })
      .then(() => {
        if (type=='update') {
          return sftp.rename(filePath, `/var/www/html/assets/cdn/display/${id}/${name}`)
          .catch(err=>{
            return  saveDisplayWithId('reset', name, id, clonedId);
          })
        }
       sftp.mkdir(`/var/www/html/assets/cdn/display/${id}`, true)
       .then(succ=>{
         if (clonedId) {
          console.log('IT IS CLONE')
          sftp.fastGet( `/var/www/html/assets/cdn/display/${clonedId}/${name}`,`${name}` )
          .then(()=>{
            console.log('UPLOADING')
            sftp.fastPut(`${name}`, `/var/www/html/assets/cdn/display/${id}/${name}`)
            .then(()=>{
              console.log('IT IS CLONE FINISHED!');
              shell.rm('-rf', `${name}`);
              console.log('FILE DELETED!');
              return;
            })
          })
          .catch(err=>{
            console.log(err);
            return;
          });
         }
         else{
          console.log('IT IS UPLOADING!');
          return sftp.rename(filePath, `/var/www/html/assets/cdn/display/${id}/${name}`)
         }
       })
       .catch(err=>{
        console.log('folder already exists')
       });
      })
    }
    return true;
  }
  catch (err) {
    console.log(err);
    return false;
  }
}

// Upload display files to CDN
async function syncDisplayToCDN(name, suffix, path) {
  try {
    if (process.env.NODE_ENV == "development" || !process.env.NODE_ENV) {
      let sftp1 = new Client();
      await sftp1
        .connect({
          host: "cdn.bwaserver.com",
          username: "ubuntu",
          privateKey: fs.readFileSync("./keys/cdnbox.pem")
        })
        .then(() => {
          return sftp1.put(
            path,
            `/var/www/html/assets/cdn/display/${name}.${suffix}`
          );
        });

      return true;
    } else {
      let sftp1 = new Client();
      await sftp1
        .connect({
          host: "cdn.anthemx.tv",
          username: "ec2-user",
          privateKey: fs.readFileSync("./keys/persistence.pem")
        })
        .then(() => {
          return sftp1.put(
            path,
            `/var/www/html/assets/cdn/display/${name}.${suffix}`
          );
        });

      return true;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

// List campaigns for dropdown components
exports.listCampaigns = function(req, res, next) {
  if (
    utils.isAllowed(req.user, actions.CREATE_FLIGHT, null) &&
    validators.id(req.body.id)
  ) {
    models.campaigns
      .findAll({
        where: {
          advertiser_id: req.body.id
          // account_id: req.user.scope_account_id
        }
      })
      .then(results => {
        const payload = [];
        results.forEach(item => {
          payload.push({
            text: item.name,
            value: item.id,
            obj: item
          });
        });
        res.send(payload);
      })
      .catch(err => {
        res
          .status(503)
          .send({
            msg: "Cannot create flights at this time. Please try again later."
          });
      });
  } else {
    res.status(401).send({ msg: "You are not authorized for this operation" });
  }
};

// List advertisers and campaigns for dropdown components in flight create/update/clone
// List advertisers and campaigns for dropdown components in flight create/update/clone
exports.listOptions = function(req, res, next) {
  // console.log('ADVERTISER ID', req.body.id.campaignId)
  if (validators.id(req.body.id.campaignId)) {
    models.campaigns
      .findOne({
        where: {
          id: req.body.id.campaignId
        },
        include: [
          {
            model: models.advertisers
          }
        ]
      })
      .then(campaign => {
        // console.log('ADVERTISER ID', campaign)
        if (campaign) {
          if (utils.isAllowed(req.user, actions.READ_CAMPAIGN, campaign)) {
            return listCampaignsAndAdvertisers(
              req.user,
              campaign.advertiser.id,
              req.body.id.master
            )
              .then(response => {
                if (response.success) {
                  const payload = {
                    campaigns: [],
                    advertisers: [],
                    campaignId: campaign.id,
                    advertiserId: campaign.advertiser.id
                  };
                  response.campaignList.forEach(item => {
                    if (item.status !== "disabled") {
                      payload.campaigns.push({
                        text: item.name,
                        value: item.id
                      });
                    }
                  });
                  response.advertiserList.forEach(item => {
                    if (item.status !== "disabled") {
                      payload.advertisers.push({
                        text: item.name,
                        value: item.id
                      });
                    }
                  });
                  res.send(payload);
                } else {
                  res
                    .status(503)
                    .send({
                      msg:
                        "Cannot create / update flights at this moment. Please try again later."
                    });
                }
              })
              .catch(err => {
                res
                  .status(503)
                  .send({
                    msg:
                      "Cannot create / update flights at this moment. Please try again later."
                  });
              });
          } else {
            res
              .status(401)
              .send({ msg: "Your anot authorized for this operation" });
          }
        } else {
          res
            .status(404)
            .send({
              msg:
                "Cannot create / update flights at this moment. Please try again later."
            });
        }
      })
      .catch(err => {
        res
          .status(503)
          .send({
            msg:
              "Cannot create / update flights at this moment. Please try again later."
          });
      });
  } else if (req.body.id.campaignId === 0) {
    let obj;
    if (req.body.id.master) {
      obj = {
        zone_id: req.user.scope_zone_id
      };
    } else {
      obj = { account_id: req.user.scope_account_id };
    }
    models.advertisers
      .findAll({
        where: obj
      })
      .then(advertisers => {
        const payload = {
          campaigns: [],
          advertisers: [],
          campaignId: 0,
          advertiserId: 0
        };
        advertisers.forEach(item => {
          if (item.status !== "disabled") {
            payload.advertisers.push({
              text: item.name,
              value: item.id
            });
          }
        });
        res.send(payload);
      })
      .catch(err => {
        res
          .status(503)
          .send({
            msg:
              "Cannot create / update flights at this moment. Please try again later."
          });
      });
  } else {
    res.status(406).send({ msg: "Your input is invalid" });
  }
};

async function listCampaignsAndAdvertisers(user, id, master) {
  try {
    if (
      utils.isAllowed(user, actions.LIST_ADVERTISERS, null) &&
      utils.isAllowed(user, actions.LIST_CAMPAIGNS, null)
    ) {
      const campaignList = await models.campaigns.findAll({
        where: {
          advertiser_id: id
        }
      });
      let obj = {};

      if (!master) {
        {
          obj = { zone_id: user.scope_zone_id };
        }
      }
      const advertiserList = await models.advertisers.findAll({
        where: obj
      });

      return {
        success: true,
        campaignList,
        advertiserList
      };
    } else {
      return {
        success: false
      };
    }
  } catch (err) {
    return {
      success: false
    };
  }
}
