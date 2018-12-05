const utils = require('../utils');
const models = require('../models');
const moment = require('moment');
const actions = require('../utils/actions');
const validators = require('../utils/validators');
const shortid = require('shortid');
const roles = require('../utils/roles');

exports.create = function (req, res, next) {
    if (validators.integration(req.body, 'create')) {
        if (utils.isAllowed(req.user, actions.CREATE_INTEGRATION, null)) {
            models.demand_integrations.findOne({
                where: {
                    name: req.body.name
                }
            })
                .then(integration => {
                    if (!integration) {
                        let value;
                        // console.log('THE VALUE', createDspValue())
                        return createDspValue()
                            .then(item => {
                                const integration = {
                                    created_at: moment().utc().unix(),
                                    name: req.body.name,
                                    value: item.curValue,
                                    notes: req.body.notes,
                                    status: 'active'
                                };
                                return models.demand_integrations.create(integration)
                                    .then(integration => {
                                        res.sendStatus(200);
                                    })
                                    .catch(err => {
                                        res.status(503).send({ msg: 'We could not create the integration at this time. Please try again later 1' });
                                    })
                            })
                            .catch(err => {
                                console.log('Error generation bitset');
                            })

                    }
                    else {
                        res.status(422).send({ msg: 'Integration with this name already exists. Please choose a different name' });
                    }
                })
                .catch(err => {
                    res.status(503).send({ msg: 'We could not create the integration at this time. Please try again later 2' });
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

exports.list = function (req, res, next) {
    if (utils.isAllowed(req.user, actions.LIST_INTEGRATIONS, null)) {
        let options = utils.generateOptions(req.body, 'integrations');
        options.where.status = 'active';
        options.attributes = ['id', 'created_at', 'name', 'status', 'value'];
        models.demand_integrations.count({
            where: options.where
        })
            .then(count => {
                return models.demand_integrations.findAll(options)
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
                        res.status(503).send({ message: "Could not display integrations at this time. Please try again later 1." });
                    })
            })
            .catch(err => {
                res.status(503).send({ message: "Could not display integrations at this time. Please try again later 2." });
            })
    }
    else {
        res.sendStatus(401);
    }
};

exports.listDisabled = function (req, res, next) {
    if (utils.isAllowed(req.user, actions.LIST_DISABLED_INTEGRATIONS, null)) {
        let options = utils.generateOptions(req.body, 'integrations');
        options.where.status = 'disabled';


        options.attributes = ['id', 'created_at', 'name', 'status'];

        models.demand_integrations.count({
            where: options.where
        })
            .then(count => {
                return models.demand_integrations.findAll(options)
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
                        res.status(503).send({ message: "Could not display integrations at this time. Please try again later 1." });
                    })
            })
            .catch(err => {
                res.status(503).send({ message: "Could not display integrations at this time. Please try again later 2s." });
            })
    }
    else {
        res.sendStatus(401);
    }
};



exports.read = function (req, res, next) {
    if (validators.id(req.body.id)) {
        models.demand_integrations.findOne({
            where: {
                id: req.body.id
            },
            attributes: ['id', 'name', 'notes', 'status']
        })
            .then(integration => {
                if (integration) {
                    if (utils.isAllowed(req.user, actions.READ_INTEGRATION, integration)) {
                        res.send(integration);
                    }
                    else {
                        res.status(401).send({ msg: 'You are not authorized' });
                    }
                }
                else {
                    res.status(404).send({ msg: 'Could not retrieve the integration at this time. Please try again later' });
                }
            })
            .catch(err => {
                res.status(503).send({ msg: "Could not retrieve the integration at this time. Please try again later" });
            })
    }
    else {
        res.status(406).send({ msg: 'Your input is invalid' });
    }
};

exports.delete = function (req, res, next) {
    if (validators.id(req.body.id)) {
        models.demand_integrations.findOne({
            where: {
                id: req.body.id
            }
        })
            .then(integration => {
                if (integration) {
                    if (utils.isAllowed(req.user, actions.DELETE_INTEGRATION, integration)) {
                        integration.status = 'disabled';
                        integration.name = `${integration.name} - ${shortid.generate()}`;
                        return integration.save()
                            .then(response => {
                                res.sendStatus(200);
                            })
                            .catch(err => {
                                res.status(503).send({ message: 'Could not delete the integration at this time. Please try again later' });
                            })
                    }
                    else {
                        res.status(401).send({ msg: 'You are not permitted to do this operation' });
                    }
                }
                else {
                    res.status(404).send({ msg: 'Could not delete the integration at this time. Please try again later' });
                }
            })
            .catch(err => {
                res.status(503).send({ msg: 'Could not delete the integration at this time. Please try again later' });
            })
    }
    else {
        res.status(406).send({ msg: 'Could not delete the integration at this time. Please try again later' });
    }
};

exports.update = function (req, res, next) {
    if (validators.integration(req.body, "update")) {
        models.demand_integrations.findOne({ where: { id: req.body.id } })
            .then(integration => {
                if (integration) {
                    if (utils.isAllowed(req.user, actions.UPDATE_INTEGRATION, integration)) {
                        integration.name = req.body.name;
                        integration.notes = req.body.notes;

                        // account_id: (req.body.account_id) ? (req.body.account_id) : (req.user.scope_account_id)
                        return integration.save()
                            .then(response => {
                                res.sendStatus(200);
                            })
                            .catch(err => {
                                res.status(503).send({ msg: 'Could not update the integration at this time. Please try again later.' });
                            })
                    }
                    else {
                        res.status(401).send({ msg: 'Your are not authorized to perform this operation' });
                    }
                }
                else {
                    res.status(404).send({ msg: 'Could not update the integration at this time. Please try again later.' });
                }
            })
            .catch(err => {
                res.status(503).send({ msg: 'Could not update the integration at this time. Please try again later.' });
            })
    }
    else {
        res.status(406).send({ msg: 'Your input is invalid' });
    }
};

exports.listAll = function (req, res, next) {
    let obj = { where: { status: 'active' } }
    if (utils.isAllowed(req.user, actions.LIST_INTEGRATIONS, null)) {
        models.demand_integrations.findAll(obj)
            .then(results => {
                let payload = [];
                results.forEach(item => {
                    payload.push({
                        text: item.name,
                        value: item.value
                        // value:item.name.toLowerCase()
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

async function createDspValue() {
    try {
        let preValue = await models.demand_integrations.max('value');
        let curValue;
        if (preValue < 1 || isNaN(preValue)) {
            curValue = 1;
        }
        else{
            curValue = parseInt(preValue) + 1;
        }
        
        return {
            success: true,
            curValue
        };
    }
    catch (err) {
        return {
            success: false
        }
    }
}