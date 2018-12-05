const check = require('check-types');
const moment = require('moment');
const validator = require('validator');


//Generate timestamp for deleted placement / flights
exports.generateTime = () => {
  return Date.now();
}

// Placement validator
exports.placement = function(placement, type) {
  const players = ['small', 'medium', 'large', 'n/a'];
  const formats = ['display', 'video'];
  const optimizers = ['cpm', 'order'];
  const channels = ['mobile_web', 'mobile_app', 'ctv', 'desktop'];
  const lists = ['none', 'whitelist', 'blacklist'];

  if (type === 'update') {
    if (!check.integer(placement.id) || check.less(placement.id, 0)) {
      return false;
    }
    if (!check.array(placement.demandList)) {
      return false;
    }
    else {
      placement.demandList.forEach(item => {
        if (!check.integer(item) || check.less(item, 0)) {
          return false;
        }
      })
    }
  }
  if (check.string(placement.playerSize)) {
    placement.playerSize = [ placement.playerSize ];
  }
  if (!check.string(placement.name) || placement.name.length < 6 || placement.name.length > 100) {
    return false;
  }
  if (!check.string(placement.notes) || placement.notes.length > 500) {
    return false;
  }
  if (!check.integer(placement.cpm) || check.less(placement.cpm, 0)) {
    return false;
  }
  if (!check.integer(placement.cpc) || check.less(placement.cpc, 0)) {
    return false;
  }
  if (!check.integer(placement.bwaCPM) || check.less(placement.bwaCPM, 0)) {
    return false;
  }
  if (!check.boolean(placement.isRevshare)) {
    return false;
  }
  if (!check.integer(placement.revShare) || !check.inRange(placement.revShare, 0, 100)) {
    return false;
  }
  if (!check.integer(placement.width) || check.less(placement.width, 0)) {
    return false;
  }
  if (!check.integer(placement.height) || check.less(placement.height, 0)) {
    return false;
  }
  if (!check.array(placement.playerSize)) {
    return false;
  }
  if (!check.integer(placement.publisherId) || check.less(placement.publisherId, 0)) {
    return false;
  }
  if (!check.string(placement.format) || !check.includes(formats, placement.format)) {
    return false;
  }
  if (!check.string(placement.listCategory) || !check.includes(lists, placement.listCategory)) {
    return false;
  }
  if (!check.integer(placement.listId) || check.less(placement.listId, 0)) {
    return false;
  }
  if (!check.string(placement.optimizer) || !check.includes(optimizers, placement.optimizer)) {
    return false;
  }
  if (!check.boolean(placement.isVastOnly)) {
    return false;
  }
  if (!check.boolean(placement.isPilotPlayer)) {
    return false;
  }
  if (!check.string(placement.channel) || !check.includes(channels, placement.channel)) {
    return false;
  }
  if (!check.array(placement.brandSafety) || check.emptyArray(placement.brandSafety)) {
    return false;
  }
  else if (!validBrandSafety(placement.brandSafety)) {
    return false;
  }
  if (!check.array(placement.caps)) {
    return false;
  }
  else if (!validCaps(placement.caps)) {
    return false;
  }
  if (!check.array(placement.targetGeo)) {
    return false;
  }
  else if (!validGeoTarget(placement.targetGeo)) {
    return false;
  }
  return true;
};

function validBrandSafety(brandSafety) {
  const brands = ['whiteops'];

  for (let i = 0; i < brandSafety.length; i++) {
    if (!check.object(brandSafety[i]) || !brandSafety[i].hasOwnProperty('name') || !brandSafety[i].hasOwnProperty('isActive') || !check.string(brandSafety[i].name) || !check.boolean(brandSafety[i].isActive) || !check.includes(brands, brandSafety[i].name)) {
      return false;
    }
  }
  return true;
}

function validCaps(caps) {
  const intervals = ['day', 'total'];
  for (let i = 0; i < caps.length; i++) {
    if (!check.object(caps[i]) || !caps[i].hasOwnProperty('id') || !caps[i].hasOwnProperty('opportunities') || !caps[i].hasOwnProperty('interval') || !caps[i].hasOwnProperty('startTime') || !caps[i].hasOwnProperty('endTime') || !check.integer(caps[i].id) || !check.integer(caps[i].opportunities) || !check.string(caps[i].interval) || !check.string(caps[i].startTime) || !check.string(caps[i].endTime) || check.less(caps[i].id, 0) || check.less(caps[i].opportunities, 0) || !check.includes(intervals, caps[i].interval)) {
      return false;
    }
    if (caps[i].startTime && caps[i].endTime && (!moment(caps[i].startTime).isValid() || !moment(caps[i].endTime).isValid())) {
      return false;
    }
  }
  return true;
}

function validGeoTarget(geo) {
  for (let i = 0; i < geo.length; i++) {
    if (!check.object(geo[i]) || !geo[i].hasOwnProperty('is_include') || !geo[i].hasOwnProperty('type') || !geo[i].hasOwnProperty('value') || !check.boolean(geo[i].is_include) || !check.string(geo[i].type) || !check.string(geo[i].value)) {
      return false;
    }
  }
  return true;
}

exports.id = function(id) {
  return check.integer(id) && check.greater(id, 0);
};

// Flight validator
exports.flight = function(flight) {
  const channels = ['mobile_app', 'mobile_web', 'desktop', 'ctv'];
  const demand = ['first_party', 'third_party', 'rtb'];
  const pacing = ['even', 'asap'];
  const formats = ['video', 'display'];
  const timeZones = ['US/Pacific', 'US/Eastern', 'UTC'];
  const status = ['active', 'inactive', 'paused', 'disabled', 'complete', 'capped'];
  const lists = ['none', 'whitelist', 'blacklist'];

  if (!flight.hasOwnProperty('flight')) {
    return false;
  }

  if (!flight.flight.hasOwnProperty('timezone') || !check.string(flight.flight.timezone) || !timeZones.includes(flight.flight.timezone)) {
    console.log('HERE 1')
    return false;
  
  }
  if (!flight.flight.hasOwnProperty('status') || !check.string(flight.flight.status) || !status.includes(flight.flight.status)) {
    console.log('HERE 2')
    return false;
  }
  if (!flight.flight.hasOwnProperty('campaignId') || !check.integer(flight.flight.campaignId) || check.lessOrEqual(flight.flight.campaignId, 0)) {
    console.log('HERE 3')
    return false;
  }
  if (!flight.flight.hasOwnProperty('name') || !check.string(flight.flight.name) || flight.flight.name.length < 6 || flight.flight.name > 100) {
    
    console.log('HERE 4')
    return false;
  }
  if (!flight.flight.hasOwnProperty('notes') || !check.string(flight.flight.notes) || flight.flight.notes.length > 500) {
    console.log('HERE 5')
    return false;
  }
  if (!flight.flight.hasOwnProperty('cpm') || !check.integer(flight.flight.cpm) || check.less(flight.flight.cpm, 0)) {
    console.log('HERE 6')
    return false;
  }
  if (!flight.flight.hasOwnProperty('cpc') || !check.integer(flight.flight.cpc) || check.less(flight.flight.cpc, 0)) {
    console.log('HERE 7')
    return false;
  }
  // if (!flight.flight.hasOwnProperty('clickthrough_url') || !check.string(flight.flight.clickthrough_url) || (flight.flight.demand_source_type === "first_party" && !isValidURL(flight.flight.clickthrough_url))) {
  //   return false;
  // }
  if (!flight.flight.hasOwnProperty('wrapper_url') || !check.string(flight.flight.wrapper_url)) {
    console.log('HERE 8')
    return false;
  }
  if (!flight.flight.hasOwnProperty('wrapper_source_platform') || !check.string(flight.flight.wrapper_source_platform)) {
    console.log('HERE 9')
    return false;
  }
  if (!flight.flight.hasOwnProperty('is_direct_deal') || !check.boolean(flight.flight.is_direct_deal)) {
    console.log('HERE 91')
    return false;
  }
  if (!flight.flight.hasOwnProperty('user_frequency_cap') || !check.integer(flight.flight.user_frequency_cap) || check.less(flight.flight.user_frequency_cap, 0)) {
    console.log('HERE 11')
    return false;
  }
  if (!flight.flight.hasOwnProperty('domain_list_id') || !check.integer(flight.flight.domain_list_id) || check.less(flight.flight.domain_list_id, 0)) {
    console.log('HERE 12')
    return false;
  }
  if (!flight.flight.hasOwnProperty('domain_list_category') || !check.string(flight.flight.domain_list_category) || !lists.includes(flight.flight.domain_list_category)) {
    console.log('HERE 13')
    return false;
  }
  if (!flight.flight.hasOwnProperty('is_muted_allowed') || !check.boolean(flight.flight.is_muted_allowed)) {
    console.log('HERE 14')
    return false;
  }
  if (!flight.flight.hasOwnProperty('is_visible_only') || !check.boolean(flight.flight.is_visible_only)) {
    console.log('HERE 15')
    return false;
  }
  if (!flight.flight.hasOwnProperty('start_time') || !check.integer(flight.flight.start_time) || check.lessOrEqual(flight.flight.start_time, 0)) {
    console.log('HERE 16')
    return false;
  }
  if (!flight.flight.hasOwnProperty('end_time') || !check.integer(flight.flight.end_time) || check.lessOrEqual(flight.flight.end_time)) {
    console.log('HERE 17')
    return false;
  }
  if (flight.flight.start_time > flight.flight.end_time) {
    console.log('HERE 18')
    return false;
  }
  if (!flight.flight.hasOwnProperty('demand_source_type') || !check.string(flight.flight.demand_source_type) || !demand.includes(flight.flight.demand_source_type)) {
    return false;
  }
  if (!flight.flight.hasOwnProperty('pacing_category') || !check.string(flight.flight.pacing_category) || !pacing.includes(flight.flight.pacing_category)) {
    console.log('HERE 19')
    return false;
  }
  if (!flight.flight.hasOwnProperty('user_agent') || !check.array(flight.flight.user_agent) || !validUserAgent(flight.flight.user_agent)) {
    console.log('HERE 20')
    return false;
  }
  if (!flight.flight.hasOwnProperty('desktop_browser_targeting') || !check.array(flight.flight.desktop_browser_targeting) || !validBrowser(flight.flight.desktop_browser_targeting)) {
    console.log('HERE 21')
    return false;
  }
  if (!flight.flight.hasOwnProperty('rtb_source') || !check.integer(flight.flight.rtb_source)) {
    console.log('HERE 22')
    return false;
  }
  if (!flight.flight.hasOwnProperty('format') || !check.string(flight.flight.format) || !formats.includes(flight.flight.format)) {
    console.log('HERE 23')
    return false;
  }
  if (!flight.flight.hasOwnProperty('channel') || !check.string(flight.flight.channel) || !channels.includes(flight.flight.channel)) {
    console.log('HERE 24')
    return false;
  }

  if (!flight.flight.hasOwnProperty('width') || !check.integer(flight.flight.width) || check.less(flight.flight.width, 0)) {
    console.log('HERE25')
    return false;
  }

  // if (flight.flight.hasOwnProperty('dealCpmFloor') && !check.integer(flight.flight.dealCpmFloor)) {
  //   console.log('HERE 40')
  //   return false;
  // }

  // if (flight.flight.hasOwnProperty('dealId') && !check.string(flight.flight.dealId)) {
  //   return false;
  // }

  if (!flight.flight.hasOwnProperty('player_size') || !check.array(flight.flight.player_size) || !validPlayerSize(flight.flight.player_size)) {
    console.log('HERE 26')
    return false;
  }
  if (!flight.flight.hasOwnProperty('is_vast_only') || !check.boolean(flight.flight.is_vast_only)) {
    console.log('HERE 27')
    return false;
  }
  
  if (!flight.flight.hasOwnProperty('iab_categories') || !check.array(flight.flight.iab_categories) || !validIAB(flight.flight.iab_categories)) {
    console.log('HERE 28')
    return false;
  }
  if (flight.flight.format === "display" && flight.flight.demand_source_type !== "rtb" && (!flight.hasOwnProperty('display') || !validDisplayCreatives(flight.display))) {
    console.log('HERE 29')
    return false;
  }
  if (!flight.hasOwnProperty('brandSafety') || !validFlightBrandSafety(flight.brandSafety)) {
    console.log('HERE 30')
    return false;
  }
  if (!flight.hasOwnProperty('dayParting') || !validDayPartings(flight.dayParting)) {
    console.log('HERE 31')
    return false;
  }
  if (!flight.hasOwnProperty('targetGeo') || !validGeoTargets(flight.targetGeo)) {
    console.log('HERE 32')
    return false;
  }
  if (!flight.hasOwnProperty('goals') || !validGoals(flight.goals)) {
    console.log('HERE 33')
    return false;
  }
  if (flight.flight.format === "video" && flight.flight.flight_type == "standard" && (!flight.hasOwnProperty('video') || !validVideoCreative(flight.video))) {
    console.log('HERE 34')
    return false;
  }
  return true;
};

function isValidURL(url) {
  const re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return re.test(url.toLowerCase()) && url.toLowerCase().includes('http');
}

function validList(list) {
  for (let i = 0; i < list.length; i++) {
    if (!check.string(list[i])) {
      return false;
    }
  }
  return true;
}

function validUserAgent(arr) {
  const userAgent = ['ios', 'android', 'mobile_other', 'windows_mobile', 'desktop'];
  for (let i = 0; i < arr.length; i++) {
    if (!check.string(arr[i]) || !userAgent.includes(arr[i])) {
      return false;
    }
  }
  return true;
}

function validBrowser(arr) {
  const browsers = ['ie/edge','chrome', 'firefox', 'safari', 'other'];
  for (let i = 0; i < arr.length; i++) {
    if (!check.string(arr[i]) || !browsers.includes(arr[i])) {
      return false;
    }
  }
  return true;
}

function validPlayerSize(arr) {
  const sizes = ['small', 'medium', 'large'];
  for (let i = 0; i < arr.length; i++) {
    if (!check.string(arr[i]) || !sizes.includes(arr[i])) {
      return false;
    }
  }
  return true;
}

function validIAB(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (!check.string(arr[i]) || !arr[i].includes('IAB')) {
      return false;
    }
  }
  return true;
}

function validFlightBrandSafety(arr) {
  const brands = ['whiteops'];
  for (let i = 0; i < arr.length; i++) {
    if (!check.object(arr[i])) {
      return false;
    }
    if (!arr[i].hasOwnProperty('is_active') || !check.boolean(arr[i].is_active)) {
      return false;
    }
    if (!arr[i].hasOwnProperty('name') || !check.string(arr[i].name) || !brands.includes(arr[i].name)) {
      return false;
    }
  }
  return true;
}

function validDisplayCreatives(obj) {
  const party = ['first_party', 'third_party'];

  if (!check.object(obj)) {
    return false;
  }
  if (!obj.hasOwnProperty('name') || !check.string(obj.name) || obj.name.length < 6 || obj.name.length > 100) {
    return false;
  }
  if (!obj.hasOwnProperty('notes') || !check.string(obj.notes) || obj.notes.length > 500) {
    return false;
  }
  if (!obj.hasOwnProperty('is_companion_creative') || !check.boolean(obj.is_companion_creative)) {
    return false;
  }
  if (!obj.hasOwnProperty('filename') || !check.string(obj.filename)) {
    return false;
  }
  if (!obj.hasOwnProperty('alt_text') || !check.string(obj.alt_text)) {
    return false;
  }
  if (!obj.hasOwnProperty('party') || !check.string(obj.party) || !party.includes(obj.party)) {
    return false;
  }
  if (!obj.hasOwnProperty('js_tag') || !check.string(obj.js_tag)) {
    return false;
  }
  if (!obj.hasOwnProperty('width') || !check.integer(obj.width) || check.lessOrEqual(obj.width, 0)) {
    return false;
  }
  if (!obj.hasOwnProperty('height') || !check.integer(obj.height) || check.lessOrEqual(obj.height, 0)) {
    return false;
  }
  return true;
}

function validDayPartings(arr) {
  if (!check.array(arr)) {
    return false;
  }
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].hasOwnProperty('end_day') || !check.string(arr[i].end_day) || !days.includes(arr[i].end_day)) {
      return false;
    }
    if (!arr[i].hasOwnProperty('end_hour') || !check.integer(arr[i].end_hour) || !check.inRange(arr[i].end_hour, 0, 23)) {
      return false;
    }
    if (!arr[i].hasOwnProperty('start_day') || !check.string(arr[i].start_day) || !days.includes(arr[i].start_day)) {
      return false;
    }
    if (!arr[i].hasOwnProperty('start_hour') || !check.integer(arr[i].start_hour) || !check.inRange(arr[i].start_hour, 0, 23)) {
      return false;
    }
  }
  return true;
}

function validGeoTargets(geo) {
  for (let i = 0; i < geo.length; i++) {
    if (!check.object(geo[i]) || !geo[i].hasOwnProperty('is_include') || !geo[i].hasOwnProperty('type') || !geo[i].hasOwnProperty('value') || !check.boolean(geo[i].is_include) || !check.string(geo[i].type) || !check.string(geo[i].value)) {
      return false;
    }
  }
  return true;
}

function validGoals(arr) {
  if (!check.array(arr)) {
    return false;
  }
  const intervals = ['day', 'total'];
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].hasOwnProperty('impressions') || !check.integer(arr[i].impressions) || check.lessOrEqual(arr[i].impressions, 0)) {
      return false;
    }
    if (!arr[i].hasOwnProperty('interval') || !check.string(arr[i].interval) || !intervals.includes(arr[i].interval)) {
      return false;
    }
    if (!arr[i].hasOwnProperty('is_budget') || !check.boolean(arr[i].is_budget)) {
      return false;
    }
  }
  return true;
}

function validVideoCreative(obj) {
  const party = ['first_party', 'third_party'];

  if (!check.object(obj)) {
    return false;
  }
  if (!obj.hasOwnProperty('name') || !check.string(obj.name) || obj.name.length < 6 || obj.name.length > 100) {
    return false;
  }
  if (!obj.hasOwnProperty('notes') || !check.string(obj.notes) || obj.notes.length > 500) {
    return false;
  }
  if (!obj.hasOwnProperty('filename') || !check.string(obj.filename)) {
    return false;
  }
  if (!obj.hasOwnProperty('alt_text') || !check.string(obj.alt_text)) {
    return false;
  }
  if (!obj.hasOwnProperty('party') || !check.string(obj.party) || !party.includes(obj.party)) {
    return false;
  }
  if (!obj.hasOwnProperty('js_tag') || !check.string(obj.js_tag)) {
    return false;
  }
  if (!obj.hasOwnProperty('width') || !check.integer(obj.width) || check.less(obj.width, 0)) {
    return false;
  }
  if (!obj.hasOwnProperty('height') || !check.integer(obj.height) || check.less(obj.height, 0)) {
    return false;
  }
  if (!obj.hasOwnProperty('content_type') || !check.string(obj.content_type)) {
    return false;
  }
  if (!obj.hasOwnProperty('bitrate') || !check.integer(obj.bitrate) || check.less(obj.bitrate, 0)) {
    return false;
  }
  if (!obj.hasOwnProperty('duration') || !check.integer(obj.duration) || check.less(obj.duration, 0)) {
    return false;
  }
  if (!obj.hasOwnProperty('companions') || !check.array(obj.companions)) {
    return false;
  }
  else {
    for (let i = 0; i < obj.companions.length; i++) {
      if (!validDisplayCreatives(obj.companions[i])) {
        return false;
      }
    }
  }
  return true;
}

// List validator
exports.list = function(list, type) {
  const status = ['append', 'replace'];

  if (!list.hasOwnProperty('typedDomains') || !check.string(list.typedDomains)) {
    return false;
  }
  if (!list.hasOwnProperty('uploadedDomains') || !check.array(list.uploadedDomains)) {
    return false;
  }
  if (type === "update" || type === "clone") {
    if (!list.hasOwnProperty('list') || !check.array(list.list)) {
      return false;
    }
    if (!list.hasOwnProperty('editStatus') || !check.string(list.editStatus) || !status.includes(list.editStatus)) {
      return false;
    }
  }
  // if (type === 'update') {
  //   if (!list.hasOwnProperty('id') || !check.integer(list.id) || !check.lessOrEqual(list.id, 0)) {
  //     return false;
  //   }
  // }
  return true;
};

// Recover password validator
exports.recover = function(obj) {
  if (!obj.hasOwnProperty('email') || !check.string(obj.email)) {
    return false;
  }
  if (!obj.hasOwnProperty('reCaptcha') || !check.string(obj.reCaptcha)) {
    return false;
  }
  return true;
};

// Register validator
exports.register = function(obj) {
  if (!obj.hasOwnProperty('company') || !check.string(obj.company) || !check.emptyString(obj.company)) {
    return false;
  }
  if (!obj.hasOwnProperty('firstName') || !check.string(obj.firstName) || !check.emptyString(obj.firstName)) {
    return false;
  }
  if (!obj.hasOwnProperty('lastName') || !check.string(obj.lastName) || !check.emptyString(obj.lastName)) {
    return false;
  }
  if (!obj.hasOwnProperty('email') || !check.string(obj.email) || !check.emptyString(obj.email)) {
    return false;
  }
  if (!obj.hasOwnProperty('password') || !check.string(obj.password) || !check.emptyString(obj.password)) {
    return false;
  }
  if (!obj.hasOwnProperty('phone') || !check.string(obj.phone)) {
    return false;
  }
  return true;
};

// Account validator
exports.account = function(account, type) {
  if (type === "update") {
    if (!account.hasOwnProperty('id') || !check.integer(account.id) || check.lessOrEqual(account.id, 0)) {
      return false;
    }
  }
  if (!account.hasOwnProperty('name') || !check.string(account.name) || account.name.length < 6 || account.name.length > 200) {
    return false;
  }
  if (!account.hasOwnProperty('notes') || !check.string(account.notes) || account.notes > 500) {
    return false;
  }
  return true;
};

// User validator
exports.user = function(user, type) {
  if (type === "update") {
    if (!user.hasOwnProperty('id') || !check.integer(user.id) || check.lessOrEqual(user.id, 0)) {
      return false;
    }
  }
  else if (type === "create") {
    if (!user.hasOwnProperty('email') || !check.string(user.email) || !validator.isEmail(user.email)) {
      return false;
    }
  }

  if (!user.hasOwnProperty('password') || !check.string(user.password)) {
    return false;
  }
  if (!user.hasOwnProperty('first_name') || !check.string(user.first_name) || user.first_name.length < 3 || user.first_name.length > 100) {
    return false;
  }
  if (!user.hasOwnProperty('last_name') || !check.string(user.last_name) ||  user.last_name.length < 3 || user.last_name.length > 100) {
    return false;
  }
  if (!user.hasOwnProperty('phone_number') || !check.string(user.phone_number)) {
    return false;
  }
  if (!user.hasOwnProperty('role') || !check.integer(user.role) || check.lessOrEqual(user.role, 0)) {
    return false;
  }
  return true;
};

// Publisher validator
exports.publisher = function(publisher, type) {
  if (type === "update") {
    if (!publisher.hasOwnProperty('id') || !check.integer(publisher.id) || check.lessOrEqual(publisher.id, 0)) {
      return false;
    }
  }
  if (!publisher.hasOwnProperty('name') || !check.string(publisher.name) || publisher.name.length < 6 || publisher.name.length > 200) {
    return false;
  }
  if (!publisher.hasOwnProperty('notes') || !check.string(publisher.notes) || publisher.notes > 500) {
    return false;
  }
  return true;
};

// Integration validator
exports.integration = function (integration, type) {
  if (type === "update") {
    if (!integration.hasOwnProperty('id') || !check.integer(integration.id) || check.lessOrEqual(integration.id, 0)) {
      return false;
    }
  }
  if (!integration.hasOwnProperty('name') || !check.string(integration.name) || integration.name.length < 2 || integration.name.length > 200) {
    return false;
  }
  if (!integration.hasOwnProperty('notes') || !check.string(integration.notes) || integration.notes > 500) {
    return false;
  }
  return true;
};

// Advertiser validator
exports.advertiser = function(publisher, type) {
  if (type === "update") {
    if (!publisher.hasOwnProperty('id') || !check.integer(publisher.id) || check.lessOrEqual(publisher.id, 0)) {
      return false;
    }
  }
  if (!publisher.hasOwnProperty('name') || !check.string(publisher.name) || publisher.name.length < 6 || publisher.name.length > 200) {
    return false;
  }
  if (!publisher.hasOwnProperty('notes') || !check.string(publisher.notes) || publisher.notes > 500) {
    return false;
  }
  return true;
};

// Campaign validator
exports.campaign = function(campaign, type) {
  if (type === 'update') {
    if (!campaign.hasOwnProperty('id') || !check.integer(campaign.id) || check.lessOrEqual(campaign.id, 0)) {
      return false;
    }
  }
  if (type === 'create') {
    if (!campaign.hasOwnProperty('advertiserId') || !check.integer(campaign.advertiserId) || check.lessOrEqual(campaign.advertiserId, 0)) {
      return false;
    }
  }
  console.log('id');
  if (!campaign.hasOwnProperty('name') || !check.string(campaign.name) || campaign.name.length < 6 || campaign.length > 100) {
    return false;
  }
  console.log('name');
  if (!campaign.hasOwnProperty('notes') || !check.string(campaign.notes) || campaign.notes.length > 500) {
    return false;
  }
  console.log('notes');
  if (!campaign.hasOwnProperty('startTime') || !check.integer(campaign.startTime)) {
    return false;
  }
  console.log('start');
  if (!campaign.hasOwnProperty('endTime') || !check.integer(campaign.endTime)) {
    return false;
  }
  console.log('end');
  if (campaign.startTime > campaign.endTime) {
    return false;
  }
  if (!campaign.hasOwnProperty('dayImpressionGoal') || !check.integer(campaign.dayImpressionGoal) || check.less(campaign.dayImpressionGoal, 0)) {
    return false;
  }
  if (!campaign.hasOwnProperty('totalImpressionGoal') || !check.integer(campaign.totalImpressionGoal) || check.less(campaign.totalImpressionGoal, 0)) {
    return false;
  }
  return true;
};

exports.demandList = function(list) {
  if (!check.array(list)) {
    return false;
  }
  for (let i = 0; i < list.length; i++) {
    if (!check.integer(list[i]) || check.lessOrEqual(list[i], 0)) {
      return false;
    }
  }
  return true;
};
