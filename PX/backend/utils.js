const actions = require('./utils/actions');
const roles = require('./utils/roles');
const moment = require('moment');
const check = require('check-types');

exports.isAllowed = function (user, action, data) {
  if (user.role & roles.SUPER_ADMIN) {
    return true;
  }
  if (user.role & roles.OPS_ADMIN) {
    return true;
  }
  if (user.role & roles.ZONE_ADMIN) {
    switch (action) {
      case actions.LIST_ACCOUNTS:
      case actions.CREATE_ACCOUNT:
      case actions.LIST_USERS:
      case actions.CREATE_USER:
      case actions.CREATE_ADVERTISER:
      case actions.LIST_ADVERTISERS:
      case actions.CREATE_CAMPAIGN:
      case actions.LIST_CAMPAIGNS:
      case actions.CREATE_PUBLISHER:
      case actions.LIST_PUBLISHERS:

      case actions.CREATE_INTEGRATION:
      case actions.LIST_INTEGRATIONS:

      case actions.CREATE_PLACEMENT:
      case actions.LIST_PLACEMENTS:
      case actions.CREATE_FLIGHT:
      case actions.LIST_FLIGHTS:
      case actions.CLONE_FLIGHT:
      case actions.LIST_DOMAIN_LISTS:
      case actions.UPLOAD_LISTS:
      case actions.CREATE_LIST:
        return true;
      case actions.READ_ACCOUNT:
      case actions.DELETE_ACCOUNT:
      case actions.UPDATE_ACCOUNT:
      case actions.ACTIVATE_ACCOUNT:
      case actions.DEACTIVATE_ACCOUNT:
      case actions.READ_USER:
      case actions.UPDATE_USER:
      case actions.DELETE_USER:
      case actions.ACTIVATE_USER:
      case actions.DEACTIVATE_USER:
      case actions.READ_ADVERTISER:
      case actions.UPDATE_ADVERTISER:
      case actions.DELETE_ADVERTISER:
      case actions.DELETE_CAMPAIGN:
      case actions.READ_CAMPAIGN:
      case actions.UPDATE_CAMPAIGN:
      case actions.ACTIVATE_CAMPAIGN:
      case actions.DEACTIVATE_CAMPAIGN:
      case actions.READ_PUBLISHER:
      case actions.DELETE_PUBLISHER:
      case actions.UPDATE_PUBLISHER:

      case actions.READ_INTEGRATION:
      case actions.DELETE_INTEGRATION:
      case actions.UPDATE_INTEGRATION:


      case actions.DELETE_PLACEMENT:
      case actions.READ_PLACEMENT:
      case actions.UPDATE_PLACEMENT:
      case actions.ACTIVATE_PLACEMENT:
      case actions.DEACTIVATE_PLACEMENT:
      case actions.DELETE_FLIGHT:
      case actions.READ_FLIGHT:
      case actions.UPDATE_FLIGHT:
      case actions.ACTIVATE_FLIGHT:
      case actions.DEACTIVATE_FLIGHT:
      case actions.READ_LIST:
      case actions.UPDATE_LIST:
      case actions.DELETE_LIST:
        if (user.zone_id === data.zone_id) {
          return true;
        }
    }
  }
  if (user.role & roles.ZONE_OPS) {
    switch (action) {
      case actions.LIST_ACCOUNTS:
      case actions.CREATE_ADVERTISER:
      case actions.LIST_ADVERTISERS:
      case actions.LIST_PUBLISHERS:
      case actions.LIST_INTEGRATIONS:
      case actions.LIST_PLACEMENTS:
      case actions.CREATE_PLACEMENT:
        return true;
      case actions.SET_SCOPE:
      case actions.READ_ADVERTISER:
      case actions.UPDATE_ADVERTISER:
      case actions.DELETE_ADVERTISER:
      case actions.READ_PUBLISHER:
      case actions.UPDATE_PUBLISHER:
      case actions.DELETE_PUBLISHER:

      case actions.READ_INTEGRATION:
      case actions.UPDATE_INTEGRATION:
      case actions.DELETE_INTEGRATION:


      case actions.DELETE_CAMPAIGN:
      case actions.UPDATE_CAMPAIGN:
      case actions.PAUSE_CAMPAIGN:
      case actions.RESUME_CAMPAIGN:
      case actions.DELETE_PLACEMENT:
      case actions.READ_PLACEMENT:
        if (user.zone_id === data.zone_id) {
          return true;
        }
    }
  }
  if (user.role & roles.ACCOUNT_ADMIN) {
    switch (action) {
      case actions.LIST_USERS:
      case actions.CREATE_USER:
      case actions.CREATE_ADVERTISER:
      case actions.LIST_ADVERTISERS:
      case actions.LIST_PUBLISHERS:
      case actions.LIST_INTEGRATIONS:
      case actions.LIST_PLACEMENTS:
      case actions.CREATE_PLACEMENT:
        return true;
      case actions.READ_USER:
      case actions.UPDATE_USER:
      case actions.DELETE_USER:
      case actions.READ_ADVERTISER:
      case actions.UPDATE_ADVERTISER:
      case actions.DELETE_ADVERTISER:
      case actions.READ_PUBLISHER:
      case actions.UPDATE_PUBLISHER:
      case actions.DELETE_PUBLISHER:

      case actions.READ_INTEGRATION:
      case actions.UPDATE_INTEGRATION:
      case actions.DELETE_INTEGRATION:


      case actions.DELETE_CAMPAIGN:
      case actions.UPDATE_CAMPAIGN:
      case actions.PAUSE_CAMPAIGN:
      case actions.RESUME_CAMPAIGN:
      case actions.DELETE_PLACEMENT:
      case actions.READ_PLACEMENT:
        if (user.account_id === data.account_id) {
          return true;
        }
    }
  }
  if (user.role & roles.ACCOUNT_OPS) {
    switch (action) {
      case actions.CREATE_ADVERTISER:
      case actions.LIST_ADVERTISERS:
      case actions.LIST_PUBLISHERS:

      case actions.LIST_INTEGRATIONS:

      case actions.LIST_PLACEMENTS:
      case actions.CREATE_PLACEMENT:
        return true;
      case actions.READ_ADVERTISER:
      case actions.UPDATE_ADVERTISER:
      case actions.DELETE_ADVERTISER:
      case actions.READ_PUBLISHER:
      case actions.UPDATE_PUBLISHER:
      case actions.DELETE_PUBLISHER:

      case actions.READ_INTEGRATION:
      case actions.UPDATE_INTEGRATION:
      case actions.DELETE_INTEGRATION:

      case actions.DELETE_CAMPAIGN:
      case actions.UPDATE_CAMPAIGN:
      case actions.PAUSE_CAMPAIGN:
      case actions.RESUME_CAMPAIGN:
      case actions.DELETE_PLACEMENT:
      case actions.READ_PLACEMENT:
        if (user.account_id === data.account_id) {
          return true;
        }
    }
  }
  if (user.role & roles.OPS_POLICY) {

  }
  if (user.role & roles.ACCOUNT_MANAGED) {

  }

  return false;
};

exports.validateUser = function (user, role) {
  let arr = [];

  if (user.hasOwnProperty('password')) {
    if (!isPasswordValid(user.password)) {
      arr.push('Please provide a valid password');
    }
  }
  else if (user.hasOwnProperty('newPassword')) {
    if (user.newPassword.length && !isPasswordValid(user.newPassword)) {
      arr.push('Please provide a valid password');
    }
  }
  else {
    arr.push('Please provide a password');
  }

  if (user.hasOwnProperty('email')) {
    if (!isEmailValid(user.email)) {
      arr.push('Please provide a valid email');
    }
  }
  else if (!user.hasOwnProperty('newPassword')) {
    arr.push('Please provide an email');
  }

  if (user.hasOwnProperty('firstName')) {
    if (user.firstName.length < 3) {
      arr.push('First Name shall be at least 3 characters long')
    }
    if (user.firstName.length > 100) {
      arr.push('First Name shall be at most 100 characters long');
    }
  }
  else {
    arr.push('Please provide a first name');
  }

  if (user.hasOwnProperty('lastName')) {
    if (user.lastName.length < 3) {
      arr.push('Last Name shall be at least 3 characters long')
    }
    if (user.lastName.length > 100) {
      arr.push('Last Name shall be at most 100 characters long');
    }
  }
  else {
    arr.push('Please provide a last name');
  }

  if (user.hasOwnProperty('phoneNumber')) {
    if (user.phoneNumber.length && (user.phoneNumber.length < 10 || user.phoneNumber.length > 15)) {
      arr.push('Please provide a valid phone number');
    }
  }

  if (user.hasOwnProperty('role')) {
    if (!Number.isInteger(user.role) || user.role === 0) {
      arr.push('Please select roles')
    }
    if (user.role < role) {
      arr.push('Please select proper roles');
    }
  }
  else {
    arr.push('Please select roles');
  }

  if (arr.length) {
    return {
      valid: false,
      messages: arr
    }
  }

  return {
    valid: true,
  }
};

exports.validateAdvertiser = function (advertiser) {
  let arr = [];

  if (advertiser.hasOwnProperty('name')) {
    if (advertiser.name.length < 6) {
      arr.push('Advertiser Name shall be at least 6 characters long');
    }
    if (advertiser.name.length > 100) {
      arr.push('Advertiser Name shall be at most 100 characters long');
    }
  }
  else {
    arr.push('Please provide advertiser name');
  }

  if (advertiser.hasOwnProperty('notes') && advertiser.notes.length > 500) {
    arr.push('Advertiser Notes shall be at most 500 characters long');
  }

  // if (advertiser.hasOwnProperty('blacklist') && !Number.isInteger(advertiser.blacklist)) {
  //   arr.push('Please provide a valid blacklist');
  // }
  //
  // if (advertiser.hasOwnProperty('whitelist') && !Number.isInteger(advertiser.whitelist)) {
  //   arr.push('Please provide a valid whitelist');
  // }

  if (arr.length) {
    return {
      valid: false,
      messages: arr
    }
  }

  return {
    valid: true,
  }
};

exports.validatePublisher = function (publisher) {
  let arr = [];

  if (publisher.hasOwnProperty('name')) {
    if (publisher.name.length < 6) {
      arr.push('Publisher Name shall be at least 6 characters long');
    }
    if (publisher.name.length > 100) {
      arr.push('Publisher Name shall be at most 100 characters long');
    }
  }
  else {
    arr.push('Please provide publisher name');
  }

  if (publisher.hasOwnProperty('notes') && publisher.notes.length > 500) {
    arr.push('Publisher Notes shall be at most 500 characters long');
  }

  // if (advertiser.hasOwnProperty('blacklist') && !Number.isInteger(advertiser.blacklist)) {
  //   arr.push('Please provide a valid blacklist');
  // }
  //
  // if (advertiser.hasOwnProperty('whitelist') && !Number.isInteger(advertiser.whitelist)) {
  //   arr.push('Please provide a valid whitelist');
  // }

  if (arr.length) {
    return {
      valid: false,
      messages: arr
    }
  }

  return {
    valid: true,
  }
};


exports.validateIntegration = function (integration) {
  let arr = [];

  if (integration.hasOwnProperty('name')) {
    if (integration.name.length < 2) {
      arr.push('Integration Name shall be at least 2 characters long');
    }
    if (integration.name.length > 100) {
      arr.push('Integration Name shall be at most 100 characters long');
    }
  }
  else {
    arr.push('Please provide integration name');
  }

  if (integration.hasOwnProperty('notes') && integration.notes.length > 500) {
    arr.push('Integration Notes shall be at most 500 characters long');
  }


  if (arr.length) {
    return {
      valid: false,
      messages: arr
    }
  }

  return {
    valid: true,
  }
};

exports.validateCampaign = function (campaign) {
  let arr = [];

  if (campaign.hasOwnProperty('name')) {
    if (campaign.name.length < 6) {
      arr.push('Campaign Name shall be at least 6 characters long');
    }
    if (campaign.name.length > 100) {
      arr.push('Advertiser Name shall be at most 100 characters long');
    }
  }
  else {
    arr.push('Please provide campaign name');
  }

  if (campaign.hasOwnProperty('notes')) {
    if (campaign.notes.length > 500) {
      arr.push('Campaign Notes shall be at most 500 characters long');
    }
  }
  else {
    arr.push('Notes were not provided');
  }

  if (campaign.hasOwnProperty('startTime')) {
    if (!moment(campaign.startTime).isValid()) {
      arr.push('Please provide a valid campaign start time');
    }
  }
  else {
    arr.push('Please provide campaign start time');
  }

  if (campaign.hasOwnProperty('endTime')) {
    if (!moment(campaign.endTime).isValid()) {
      arr.push('Please provide a valid campaign end time');
    }
  }
  else {
    arr.push('Please provide campaign end time');
  }

  if (campaign.startTime > campaign.endTime) {
    arr.push('Campaign start time shall be earlier than campaign end time');
  }

  if (campaign.hasOwnProperty('dayImpressionGoal')) {
    if (!Number.isInteger(campaign.dayImpressionGoal)) {
      arr.push('Please provide a valid daily impression goal');
    }
  }
  else {
    arr.push('Please provide campaign goals');
  }

  if (campaign.hasOwnProperty('totalImpressionGoal')) {
    if (!Number.isInteger(campaign.totalImpressionGoal)) {
      arr.push('Please provide a valid total impression goal');
    }
  }
  else {
    arr.push('Please provide campaign goals');
  }

  if (arr.length) {
    return {
      valid: false,
      messages: arr
    }
  }

  return {
    valid: true,
  }
};

exports.validatePlacement = function (placement) {
  return {
    valid: true
  }
};

function isEmailValid(email) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email) && email.length < 100;
}

function isPasswordValid(password) {
  let re = /[0-9]/;
  if (!re.test(password)) {
    return false;
  }
  re = /[a-z]/;
  if (!re.test(password)) {
    return false;
  }
  re = /[A-Z]/;
  if (!re.test(password)) {
    return false;
  }
  if (password.length < 6) {
    return false;
  }
  if (password.length > 20) {
    return false;
  }

  return true;
}

exports.generateDspOptions = function (data, type) {
  let dspOptions = {};
  if (!isNaN(data.searchTerm) && !data.searchTerm == '') {
    let digits = [];
    for (let index = 0; index < parseInt(data.searchTerm) + 10000; index++) {
      if ((index + '').indexOf(data.searchTerm.toString()) > -1) {
        digits.push(index);
      }
    }
    dspOptions = {
      where: {
        rtb_source: {
          $eq: parseInt(data.dsp)
        },
        id: {
          $in: digits
        },
        status: {
          $or: type
        }

      },
      order: [
        ['id', 'ASC']
      ],

      limit: 15,
      offset: 0
    }
  } else {
    dspOptions = {
      where: {
        rtb_source: {
          $eq: parseInt(data.dsp)
        },
        name: {
          $iLike: `%${data.searchTerm}%`
        },
        status: {
          $or: type
        }
      },
      order: [
        ['id', 'DESC']
      ],

      limit: 15,
      offset: 0
    }
  }
  return dspOptions;
}

exports.generateOptions = function (data, type) {
  let sortOptions;
  var numbers = /^[0-9]+$/;
  switch (type) {
    case "accounts":
      sortOptions = ['id', 'name', 'created_at', 'status'];
      break;
    case "users":
      sortOptions = ['id', 'first_name', 'last_name', 'email', 'created_at', 'status'];
      break;
    case "integrations":
    case "publishers":
    case "advertisers":
      sortOptions = ['id', 'name', 'created_at'];
      break;
    case 'placements':
      sortOptions = ['id', 'name', 'channel', 'format', 'status', 'created_at'];
      break;
    case 'campaigns':
      sortOptions = ['id', 'name', 'start_time', 'end_time', 'status'];
      break;
    case 'flights':
      sortOptions = ['id', 'name', 'channel', 'format', 'status', 'start_time', 'end_time'];
      break;
  }

  const sortDirection = ['asc', 'desc'];

  let options = {
    where: {},
    order: [
      ['id', 'desc']
    ],
    limit: 15,
    offset: 0
  };

  if (data.hasOwnProperty('searchTerm')) {
    if (type !== "users") {
      if (!isNaN(data.searchTerm) && !data.searchTerm == '' && data.searchTerm.match(numbers)) {
        let digits = [data.searchTerm];
        // Fix for search by ID to return multiple item maching the search parameter
        for (let index = 0; index < 10000; index++) {
          if ((index + '').indexOf(data.searchTerm.toString()) > -1) {
            digits.push(index);
          }
        }
        options.where.id = {
          $in: digits
        }
        options.order[0][1] = 'asc';
      }
      else {
        options.where.name = {
          $iLike: `%${data.searchTerm}%`
        }
      }
    }

    else {
      if (!isNaN(data.searchTerm) && !data.searchTerm == '' && data.searchTerm.match(numbers)) {
        let digits = [data.searchTerm];
        // Fix for search by ID to return multiple item maching the search parameter
        for (let index = 0; index < 10000; index++) {
          if ((index + '').indexOf(data.searchTerm.toString()) > -1) {
            digits.push(index);
          }
        }
        options.where.id = {
          $in: digits
        }
        options.order[0][1] = 'asc';
      }
      else {
        options.where['$or'] = {
          first_name: {
            $iLike: `%${data.searchTerm}%`
          },
          last_name: {
            $iLike: `%${data.searchTerm}%`
          }
        };
      }
    }
  }
  if (data.hasOwnProperty('sortBy') && sortOptions.includes(data.sortBy)) {
    options.order[0][0] = data.sortBy;
  }
  if (data.hasOwnProperty('sortDirection') && sortDirection.includes(data.sortDirection) && !(!isNaN(data.searchTerm) && !data.searchTerm == '' && data.searchTerm.match(numbers))) {
    options.order[0][1] = data.sortDirection;
  }
  if (data.hasOwnProperty('pageChunk') && check.integer(data.pageChunk) && check.greater(data.pageChunk, 0)) {
    options.limit = data.pageChunk;
  }
  if (data.hasOwnProperty('currentPage') && check.integer(data.currentPage) && check.greater(data.currentPage, 0)) {
    options.offset = (data.currentPage - 1) * options.limit;
  }
  return options;
};

exports.activeItems = function (items) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].status !== 'disabled') {
      return true;
    }
  }
  return false;
};

