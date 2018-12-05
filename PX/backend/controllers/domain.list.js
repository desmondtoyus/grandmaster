const utils = require('../utils');
const models = require('../models');
const moment = require('moment');
const actions = require('../utils/actions');
const csv = require('csv');
const fs = require('fs');
const validator = require('validator');
const shell = require('shelljs');
const validators = require('../utils/validators');

// List domain lists
exports.list = function (req, res, next) {
  var numbers = /^[0-9]+$/;
  if (utils.isAllowed(req.user, actions.LIST_DOMAIN_LISTS, null)) {
    let options = {
      where: {
        account_id: req.user.scope_account_id
      }
    };

    options.order = [
      ['id', 'desc']
    ];

    if (!!req.body.searchTerm) {
      if (!isNaN(req.body.searchTerm) && !req.body.searchTerm == '' && req.body.searchTerm.match(numbers)) {
        let digits = [req.body.searchTerm];
        // Fix for search by ID to return multiple item maching the search parameter
        for (let index = 0; index < 10000; index++) {
          if ((index + '').indexOf(req.body.searchTerm.toString()) > -1) {
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
          $iLike: `%${req.body.searchTerm}%`
        }
      }
    }
    if (!!req.body.sortBy) {
      options.order[0][0] = req.body.sortBy;
    }
    if (!!req.body.sortDirection) {
      options.order[0][1] = req.body.sortDirection;
    }
    options.limit = 15;
    options.offset = 0;
    if (!!req.body.pageChunk) {
      options.limit = req.body.pageChunk;
    }
    if (!!req.body.currentPage) {
      options.offset = (req.body.currentPage - 1) * options.limit;
    }
    options.attributes = ['id', 'name', 'value'];
    // NEW listType: 'bundle_id'
    options.where.domain_list_type = req.body.listType;
    models.domain_lists.count(count => {
      where: options.where
    })
      .then(count => {
        return models.domain_lists.findAll(options)
          .then(results => {
            // console.log('RESULT=', results)
            const payload = {};
            payload.rows = results;
            payload.pagination = {
              currentPage: req.body.currentPage || 1,
              limit: req.body.pageChunk || 15,
              totalPages: Math.ceil(count / (req.body.pageChunk || 15))
            };
            res.json(payload);
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
    res.sendStatus(401);
  }
};

// Upload domain list
exports.upload = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.UPLOAD_LISTS, null)) {
    const arr = [];
    invalidArr = [];
    let valid = 0;
    let invalid = 0;
    if (req.files.list.type === "text/csv") {
      const file = fs.readFileSync(req.files.list.path);
      csv.parse(file, function (err, data) {
        data.forEach(item => {
          const domain = processDomain(item[0].toLowerCase());
          if (validator.isFQDN(domain) && !arr.includes(domain)) {
            arr.push(domain);
            valid++;
          }
          else {
            invalidArr.push(domain)
            invalid++;
          }
        });
        shell.rm('-rf', req.files.list.path);
        res.status(200).send({ msg: `Uploaded ${valid} valid domains. ${invalid} domains are invalid.`, domains: arr, invalidArr });
      });
    }
    else if (req.files.list.type === "text/plain") {
      const file = fs.readFileSync(req.files.list.path, 'utf8');
      const newLineFiles = file.split('\n');
      const files = [];
      newLineFiles.forEach(item => {
        files.push(...item.split(','));
      });
      files.forEach(item => {
        const domain = processDomain(item.toLowerCase());
        if (validator.isFQDN(domain) && !arr.includes(domain)) {
          arr.push(domain);
          valid++;
        }
        else {
          invalidArr.push(domain)
          invalid++;
        }
      });
      shell.rm('-rf', req.files.list.path);
      res.status(200).send({ msg: `Uploaded ${valid} valid domains. ${invalid} domains are invalid.`, domains: arr, invalidArr });
    }
  }
  else {
    shell.rm('-rf', req.files.list.path);
    res.sendStatus(401);
  }
};


exports.uploadBundle = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.UPLOAD_LISTS, null)) {
    invalidArr = [];
    const arr = [];
    let valid = 0;
    let invalid = 0;
    if (req.files.list.type === "text/csv") {
      const file = fs.readFileSync(req.files.list.path);
      csv.parse(file, function (err, data) {
        data.forEach(item => {
          const domain = processDomain(item[0].toLowerCase());
          if (!arr.includes(domain) && (!/[`~<>;#"|{}=?+]/.test(domain)) && domain) {
            arr.push(domain);
            valid++;
          }
          else {
          invalidArr.push(domain)
            invalid++;
          }
        });
        shell.rm('-rf', req.files.list.path);
        res.status(200).send({ msg: `Uploaded ${valid} valid bundle IDs. ${invalid} bundle IDs are invalid.`, domains: arr, invalidArr });
      });
    }
    else if (req.files.list.type === "text/plain") {
      const file = fs.readFileSync(req.files.list.path, 'utf8');
      const newLineFiles = file.split('\n');
      const files = [];
      newLineFiles.forEach(item => {
        files.push(...item.split(','));
      });
      files.forEach(item => {
        const domain = processDomain(item.toLowerCase());
        if (!arr.includes(domain) && (!/[`~<>;#"|{}=?+]/.test(domain)) && domain) {
          arr.push(domain);
          valid++;
        }
        else {
          invalidArr.push(domain)
          invalid++;
        }
      });
      shell.rm('-rf', req.files.list.path);
      res.status(200).send({ msg: `Uploaded ${valid} valid bundle IDs. ${invalid} bundle IDs are invalid.`, domains: arr, invalidArr });
    }
  }
  else {
    shell.rm('-rf', req.files.list.path);
    res.sendStatus(401);
  }
};



exports.uploadIp = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.UPLOAD_LISTS, null)) {
    const arr = [];
    invalidArr = [];
    let valid = 0;
    let invalid = 0;
    if (req.files.list.type === "text/csv") {
      const file = fs.readFileSync(req.files.list.path);
      csv.parse(file, function (err, data) {
        data.forEach(item => {
          const domain = processDomain(item[0].toLowerCase());
          if (!arr.includes(domain) && ValidateIPaddress(domain) && domain) {
            arr.push(domain);
            valid++;
          }
          else {
            invalidArr.push(domain)
            invalid++;
          }
        });
        shell.rm('-rf', req.files.list.path);
        res.status(200).send({ msg: `Uploaded ${valid} valid ip addresses. ${invalid} ip addresses are invalid.`, domains: arr, invalidArr });
      });
    }
    else if (req.files.list.type === "text/plain") {
      const file = fs.readFileSync(req.files.list.path, 'utf8');
      const newLineFiles = file.split('\n');
      const files = [];
      newLineFiles.forEach(item => {
        files.push(...item.split(','));
      });
      files.forEach(item => {
        const domain = processDomain(item.toLowerCase());
        if (!arr.includes(domain) && ValidateIPaddress(domain)  && domain) {
          arr.push(domain);
          valid++;
        }
        else {
          invalidArr.push(domain)
          invalid++;
        }
      });
      shell.rm('-rf', req.files.list.path);
      res.status(200).send({ msg: `Uploaded ${valid} valid ip addresses. ${invalid} ip addresses are invalid.`, domains: arr, invalidArr });
    }
  }
  else {
    shell.rm('-rf', req.files.list.path);
    res.sendStatus(401);
  }
};

exports.uploadApp = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.UPLOAD_LISTS, null)) {

    const arr = [];
    invalidArr = [];
    let valid = 0;
    let invalid = 0;
    if (req.files.list.type === "text/csv") {
      const file = fs.readFileSync(req.files.list.path);
      csv.parse(file, function (err, data) {
        data.forEach(item => {
          const domain = processDomain(item[0].toLowerCase());
          if (!arr.includes(domain) && (!/[`~<>;#"|{}=?+] /.test(domain)) && domain) {
            arr.push(domain);
            valid++;
          }
          else {
            invalidArr.push(domain)
            invalid++;
          }
        });
        shell.rm('-rf', req.files.list.path);
        res.status(200).send({ msg: `Uploaded ${valid} valid app names. ${invalid} app names are invalid.`, domains: arr, invalidArr });
      });
    }
    else if (req.files.list.type === "text/plain") {
      const file = fs.readFileSync(req.files.list.path, 'utf8');
      const newLineFiles = file.split('\n');
      const files = [];
      newLineFiles.forEach(item => {
        files.push(...item.split(','));
      });
      files.forEach(item => {
        const domain = processDomain(item.toLowerCase());
        if (!arr.includes(domain) && (!/[`~<>;#"|{}=?+]/.test(domain)) && domain) {
          arr.push(domain);
          valid++;
        }
        else {
          invalidArr.push(domain)
          invalid++;
        }
      });
      shell.rm('-rf', req.files.list.path);
      res.status(200).send({ msg: `Uploaded ${valid} valid app names. ${invalid} app IDs are invalid.`, domains: arr, invalidArr });
    }
  }
  else {
    shell.rm('-rf', req.files.list.path);
    res.sendStatus(401);
  }
};

// Create domain list
exports.create = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.CREATE_LIST, null)) {
    if (validators.list(req.body, 'create')) {
      const listArray = generateList(req.body.uploadedDomains, req.body.typedDomains, req.body.listType);
      if (listArray.length) {
        const list = {
          name: req.body.name,
          value: generateList(req.body.uploadedDomains, req.body.typedDomains, req.body.listType),
          account_id: req.user.scope_account_id,
          zone_id: req.user.scope_zone_id,
          domain_list_type: req.body.listType

        };
        models.domain_lists.create(list)
          .then(list => {
            res.sendStatus(200);
          })
          .catch(err => {
            res.sendStatus(503);
          })
      }
      else {
        res.sendStatus(406);
      }
    }
    else {
      res.sendStatus(406);
    }
  }
  else {
    res.sendStatus(401);
  }
};

// Read domain list
exports.read = function (req, res, next) {
  if (validators.id(req.body.id)) {

    models.domain_lists.findOne({
      where: {
        id: req.body.id
      }
    })
      .then(list => {
        if (list) {
          if (utils.isAllowed(req.user, actions.READ_LIST, list)) {
            res.send(list);
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

// Update domain list
exports.update = function (req, res, next) {
  if (validators.list(req.body, 'update')) {
    models.domain_lists.findOne({
      where: {
        id: req.body.id
      }
    })
      .then(list => {
        if (list) {
          if (utils.isAllowed(req.user, actions.UPDATE_LIST, list)) {
            list.name = req.body.name;
            list.value = generateUpdatedList(req.body);
            return list.save()
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

// Delete domain list
exports.delete = function (req, res, next) {
  if (validators.id(req.body.id)) {
    models.domain_lists.findOne({
      where: {
        id: req.body.id
      }
    })
      .then(list => {
        if (list) {
          if (utils.isAllowed(req.user, actions.DELETE_LIST, list)) {
            return list.destroy()
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

// Clone domain list
exports.clone = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.CREATE_LIST, null)) {
    if (validators.list(req.body, 'clone')) {
      const listArray = generateUpdatedList(req.body);
      if (listArray.length) {
        const list = {
          name: req.body.name,
          value: listArray,
          account_id: req.user.scope_account_id,
          zone_id: req.user.scope_zone_id,
          domain_list_type: req.body.listType
        };
        models.domain_lists.create(list)
          .then(list => {
            res.sendStatus(200);
          })
          .catch(err => {
            res.sendStatus(503);
          })
      }
      else {
        res.sendStatus(406);
      }
    }
    else {
      res.sendStatus(406);
    }
  }
  else {
    res.sendStatus(401);
  }
};

// List all domain lists for dropdown component
exports.listAll = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_DOMAIN_LISTS, null)) {
    let obj;
    if (req.params.id) {
      obj = {
        account_id: req.user.scope_account_id,
        domain_list_type: req.params.id
      }
    } else {
      obj = {
        account_id: req.user.scope_account_id
      }
    }
    models.domain_lists.findAll({
      where: obj
    })
      .then(results => {
        const arr = [];
        results.forEach(item => {
          arr.push({
            text: item.name,
            value: item.id
          })
        });
        res.send(arr);
      })
      .catch(err => {
        res.sendStatus(503);
      })
  }
  else {
    res.sendStatus(401);
  }
};


exports.type = function (req, res, next) {
  if (utils.isAllowed(req.user, actions.LIST_DOMAIN_TYPE, null)) {
    models.domain_lists.findOne({
      where: {
        id: req.body.id
      }
    })
      .then(result => {
        res.send(result.domain_list_type);
      })
      .catch(err => {
        res.sendStatus(503);
      })
  }
  else {
    res.sendStatus(401);
  }
};
/**
 * Generate single array of all lists consists of typed domains and uploaded domains
 * @param uploaded domains
 * @param typed domains
 * @returns ARRAY of domain lists
 */
function generateList(uploaded, typed, listType) {
  const arr = uploaded;

  typed = typed.split('\n');
  const domains = [];
  typed.forEach(item => {
    domains.push(...item.split(','));
  });

  domains.forEach(item => {
    const domain = processDomain(item.toLowerCase());
    if ((listType == 'app_name' || listType == 'bundle_id') && !arr.includes(domain) && (!/[`~<>;#"|{}=?+]/.test(domain)) && domain) {
      arr.push(domain);
    }
    else if (listType == 'ip_address' && ValidateIPaddress(domain)){
      arr.push(domain);
    }
    else if (validator.isFQDN(domain) && !arr.includes(domain)) {
      arr.push(domain);
    }
  });

  return arr;
}

/**
 * Checks if the domain includes prefix of 'http' or 'https'. As well 'www' and removes them.
 * @param domain
 * @returns domain with no prefixes
 */
function processDomain(domain) {
  domain = domain.trim();
  if (domain.includes('http://')) {
    domain = domain.substr(7);
  }
  if (domain.includes('https://')) {
    domain = domain.substr(8);
  }
  if (domain.includes('www')) {
    domain = domain.substr(4);
  }
  console.log(domain);
  return domain;
}

function ValidateIPaddress(ipaddress) {
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
    return true;
  }
  return false;
} 

/**
 * Generates single array of all lists consists of existing domains, typed domains and uploaded domains. Checks if the new domains shall replace the existing domains or add to them.
 * @param obj
 * @returns ARRAY of domain lists
 */
function generateUpdatedList(obj) {
  let list = obj.list;
  if (obj.editStatus === "replace") {
    list = obj.uploadedDomains;
  }
  else if (obj.editStatus === "append") {
    obj.uploadedDomains.forEach(item => {
      if (!list.includes(item)) {
        list.push(item);
      }
    })
  }

  let typed = obj.typedDomains.split('\n');
  const domains = [];
  typed.forEach(item => {
    domains.push(...item.split(','));
  });

  domains.forEach(item => {
    const domain = processDomain(item.toLowerCase());
    if ((obj.listType == 'app_name' || obj.listType == 'bundle_id') && !list.includes(domain) && (!/[`~<>;#"|{}=?+]/.test(domain)) && domain) {
      list.push(domain);
    }
    else if (validator.isFQDN(domain) && !list.includes(domain)) {
      list.push(domain);
    }
  });

  return list;
}
