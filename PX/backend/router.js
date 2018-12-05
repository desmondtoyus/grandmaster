const Public = require('./controllers/public');
const Account = require('./controllers/account');
const User = require('./controllers/user');
const Advertiser = require('./controllers/advertiser');
const Campaign = require('./controllers/campaign');
const Publisher = require('./controllers/publisher');
const Integration = require('./controllers/integration');
const Placement = require('./controllers/placement');
const Flight = require('./controllers/flight');
const Lists = require('./controllers/domain.list');
const passportService = require('./services/passport');
const passport = require('passport');
const bodyParser = require('body-parser').json();
const multiplart = require('connect-multiparty');
const multipartMiddleware = multiplart({ uploadDir: '/tmp/' });
let db = require("./models");

const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function (app) {
  // Public Routes
  app.post('/public/login', bodyParser, requireSignin, Public.login);
  app.post('/public/register', bodyParser, Public.register);
  app.post('/public/recover', bodyParser, Public.recover);
  // Account Routes
  app.post('/account/master_list', requireAuth, bodyParser, Account.master_list);
  app.post('/account/list', requireAuth, bodyParser, Account.list);
  app.post('/account/list_pending', requireAuth, bodyParser, Account.listPending);
  app.post('/account/list_disabled', requireAuth, bodyParser, Account.listDisabled);
  app.post('/account/scope_list', requireAuth, bodyParser, Account.scopeList);
  app.post('/account/read', requireAuth, bodyParser, Account.read);
  app.post('/account/create', requireAuth, bodyParser, Account.create);
  app.post('/account/delete', requireAuth, bodyParser, Account.delete);
  app.post('/account/update', requireAuth, bodyParser, Account.update);
  app.post('/account/activate', requireAuth, bodyParser, Account.activate);
  app.post('/account/deactivate', requireAuth, bodyParser, Account.deactivate);
  // User Routes
  app.post('/user/scope', requireAuth, bodyParser, User.scope);
  app.get('/user/read', requireAuth, User.readActive);
  app.post('/user/read', requireAuth, bodyParser, User.read);
  app.post('/user/list', requireAuth, bodyParser, User.list);
  app.post('/user/create', requireAuth, bodyParser, User.create);
  app.post('/user/update', requireAuth, bodyParser, User.update);
  app.post('/user/delete', requireAuth, bodyParser, User.delete);
  app.post('/user/timezone', requireAuth, bodyParser, User.timezone);
  app.post('/user/list_disabled', requireAuth, bodyParser, User.listDisabled);
  app.post('/user/activate', requireAuth, bodyParser, User.activate);
  app.post('/user/deactivate', requireAuth, bodyParser, User.deactivate);
  // Advertiser Routes
  app.post('/advertiser/create', requireAuth, bodyParser, Advertiser.create);
  app.post('/advertiser/list', requireAuth, bodyParser, Advertiser.list);
  app.post('/advertiser/list_disabled', requireAuth, bodyParser, Advertiser.listDisabled);
  app.post('/advertiser/read', requireAuth, bodyParser, Advertiser.read);
  app.post('/advertiser/update', requireAuth, bodyParser, Advertiser.update);
  app.post('/advertiser/delete', requireAuth, bodyParser, Advertiser.delete);
  app.get('/advertiser/list', requireAuth, Advertiser.listAll);
  // Campaign Routes
  app.post('/campaign/create', requireAuth, bodyParser, Campaign.create);
  app.post('/campaign/delete', requireAuth, bodyParser, Campaign.delete);
  app.post('/campaign/tag', requireAuth, bodyParser, Campaign.tag);
  app.post('/campaign/list', requireAuth, bodyParser, Campaign.list);
  app.post('/campaign/list_active', requireAuth, bodyParser, Campaign.listActive);
  app.post('/campaign/list_inactive', requireAuth, bodyParser, Campaign.listInactive);
  app.post('/campaign/list_disabled', requireAuth, bodyParser, Campaign.listDisabled);
  app.post('/campaign/read', requireAuth, bodyParser, Campaign.read);
  //find campaign dates
  app.get('/api/dates/:id', requireAuth, Campaign.date);
  app.post('/campaign/update', requireAuth, bodyParser, Campaign.update);
  app.post('/campaign/activate', requireAuth, bodyParser, Campaign.activate);
  app.post('/campaign/deactivate', requireAuth, bodyParser, Campaign.deactivate);
  app.post('/campaign/list_advertiser_campaigns', requireAuth, bodyParser, Campaign.listAdvertiserCampaigns);
  app.get('/campaign/list_advertisers/:master', requireAuth, Campaign.listAdvertisers);
  // Publisher Routes
  app.post('/publisher/create', requireAuth, bodyParser, Publisher.create);
  app.post('/publisher/list', requireAuth, bodyParser, Publisher.list);
  app.post('/publisher/list_disabled', requireAuth, bodyParser, Publisher.listDisabled);
  app.post('/publisher/read', requireAuth, bodyParser, Publisher.read);
  app.post('/publisher/delete', requireAuth, bodyParser, Publisher.delete);
  app.post('/publisher/update', requireAuth, bodyParser, Publisher.update);
  app.get('/publisher/list/:master', requireAuth, Publisher.listAll);

  // integrations
  app.post('/integration/create', requireAuth, bodyParser, Integration.create);
  app.post('/integration/list', requireAuth, bodyParser, Integration.list);
  app.post('/integration/list_disabled', requireAuth, bodyParser, Integration.listDisabled);
  app.post('/integration/read', requireAuth, bodyParser, Integration.read);
  app.post('/integration/delete', requireAuth, bodyParser, Integration.delete);
  app.post('/integration/update', requireAuth, bodyParser, Integration.update);
  app.get('/integration/list/', requireAuth, Integration.listAll);
  // Placement Routes
  app.post('/placement/create', requireAuth, bodyParser, Placement.create);
  app.post('/placement/delete', requireAuth, bodyParser, Placement.delete);
  app.post('/placement/list', requireAuth, bodyParser, Placement.list);
  app.post('/placement/list_active', requireAuth, bodyParser, Placement.listActive);
  app.post('/placement/list_inactive', requireAuth, bodyParser, Placement.listInactive);
  app.post('/placement/list_disabled', requireAuth, bodyParser, Placement.listDisabled);
  app.post('/placement/read', requireAuth, bodyParser, Placement.read);
  app.post('/placement/read_opportunity_count', requireAuth, bodyParser, Placement.readOpportunityCount);
 
  app.post('/placement/update', requireAuth, bodyParser, Placement.update);
  app.post('/placement/activate', requireAuth, bodyParser, Placement.activate);
  app.post('/placement/deactivate', requireAuth, bodyParser, Placement.deactivate);
  app.post('/placement/tag', requireAuth, bodyParser, Placement.tag);
  app.post('/placement/video_tag', requireAuth, bodyParser, Placement.playerTag);
  app.post('/placement/list_demand', requireAuth, bodyParser, Placement.listDemand);
  app.post('/placement/demand_list', requireAuth, bodyParser, Placement.demandList);
  app.post('/placement/update_demand', requireAuth, bodyParser, Placement.updateDemand);
  // Flight Routes
  app.post('/flight/create', requireAuth, bodyParser, Flight.create);
  app.post('/flight/delete', requireAuth, bodyParser, Flight.delete);
  app.post('/flight/tag', requireAuth, bodyParser, Flight.tag);
  app.post('/flight/list', requireAuth, bodyParser, Flight.list);
  app.post('/flight/list_active', requireAuth, bodyParser, Flight.listActive);
  app.post('/flight/list_inactive', requireAuth, bodyParser, Flight.listInactive);

  app.post('/flight/list_paused', requireAuth, bodyParser, Flight.listPaused);
  app.post('/flight/list_disabled', requireAuth, bodyParser, Flight.listDisabled);
  app.post('/flight/read', requireAuth, bodyParser, Flight.read);
  app.post('/flight/update', requireAuth, bodyParser, Flight.update);
  app.post('/flight/clone', requireAuth, bodyParser, Flight.clone);
  app.post('/flight/display_upload', requireAuth, multipartMiddleware, Flight.displayUpload);
  app.post('/flight/video_upload', requireAuth, multipartMiddleware, Flight.videoUpload);
  app.post('/flight/activate', requireAuth, bodyParser, Flight.activate);
  app.post('/flight/deactivate', requireAuth, bodyParser, Flight.deactivate);
  app.post('/flight/pause', requireAuth, bodyParser, Flight.pause);
  app.post('/flight/disable', requireAuth, bodyParser, Flight.disable);
  app.post('/flight/list_campaigns', requireAuth, bodyParser, Flight.listCampaigns);
  app.post('/flight/list_options', requireAuth, bodyParser, Flight.listOptions);
  app.post('/flight/update_supply', requireAuth, bodyParser, Flight.updateSupply);

  app.post('/flight/list_supply', requireAuth, bodyParser, Flight.listSupply);
  app.post('/flight/supply_list', requireAuth, bodyParser, Flight.supplyList);
  // Lists Routes
  app.post('/lists/list', requireAuth, bodyParser, Lists.list);
  app.post('/lists/type', requireAuth, bodyParser, Lists.type);
  app.post('/lists/upload', requireAuth, multipartMiddleware, Lists.upload);

  app.post('/lists/uploadbundle', requireAuth, multipartMiddleware, Lists.uploadBundle);
  app.post('/lists/uploadapp', requireAuth, multipartMiddleware, Lists.uploadApp);

  
  app.post('/lists/uploadip', requireAuth, multipartMiddleware, Lists.uploadIp);

  app.post('/lists/create', requireAuth, bodyParser, Lists.create);
  app.post('/lists/read', requireAuth, bodyParser, Lists.read);
  app.post('/lists/update', requireAuth, bodyParser, Lists.update);
  app.post('/lists/delete', requireAuth, bodyParser, Lists.delete);
  app.post('/lists/clone', requireAuth, bodyParser, Lists.clone);
  app.get('/lists/list/:id', requireAuth, Lists.listAll);
};
