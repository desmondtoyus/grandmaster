const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

let db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Models
db.users = require('./users')(sequelize, Sequelize);
db.accounts = require('./accounts')(sequelize, Sequelize);
db.zones = require('./zones')(sequelize, Sequelize);
db.advertisers = require('./advertisers')(sequelize, Sequelize);
db.campaigns = require('./campaigns')(sequelize, Sequelize);
db.domain_lists = require('./domain.lists')(sequelize, Sequelize);
db.publishers = require('./publishers')(sequelize, Sequelize);

db.demand_integrations = require('./demand_integrations')(sequelize, Sequelize);

db.placements = require('./placements')(sequelize, Sequelize);
db.placement_brand_safety_providers = require('./placement.brand.safety.providers')(sequelize, Sequelize);
db.placement_caps = require('./placement.caps')(sequelize, Sequelize);
db.placement_geo_targets = require('./placement.geo.targets')(sequelize, Sequelize);
db.flights = require('./flights')(sequelize, Sequelize);
db.flight_brand_safety_providers = require('./flight.brand.safety.providers')(sequelize, Sequelize);
db.flight_day_partings = require('./flight.day.partings')(sequelize, Sequelize);
db.flight_geo_targets = require('./flight.geo.targets')(sequelize, Sequelize);
db.flight_goals = require('./flight.goals')(sequelize, Sequelize);
db.display_creatives = require('./display.creatives')(sequelize, Sequelize);
db.video_creatives = require('./video.creatives')(sequelize, Sequelize);

// Accounts Relations
db.accounts.belongsTo(db.zones);
db.zones.hasMany(db.accounts);

// User Relations
db.users.belongsTo(db.accounts);
db.users.belongsTo(db.zones);
db.zones.hasMany(db.users);
db.accounts.hasMany(db.users);

// Advertisers Relations
db.advertisers.belongsTo(db.zones);
db.advertisers.belongsTo(db.accounts);
db.zones.hasMany(db.advertisers);
db.accounts.hasMany(db.advertisers);

// Campaigns Relations
db.campaigns.belongsTo(db.advertisers);
db.campaigns.belongsTo(db.accounts);
db.campaigns.belongsTo(db.zones);
db.advertisers.hasMany(db.campaigns);
db.accounts.hasMany(db.campaigns);
db.zones.hasMany(db.campaigns);

// Domain Lists Relations
db.domain_lists.belongsTo(db.zones);
db.domain_lists.belongsTo(db.accounts);
db.zones.hasMany(db.domain_lists);
db.accounts.hasMany(db.domain_lists);

// Publishers Relations
db.publishers.belongsTo(db.zones);
db.publishers.belongsTo(db.accounts);
db.zones.hasMany(db.publishers);
db.accounts.hasMany(db.publishers);

// Placements Relations
db.placements.belongsTo(db.zones);
db.placements.belongsTo(db.accounts);
db.placements.belongsTo(db.publishers);
db.zones.hasMany(db.placements);
db.accounts.hasMany(db.placements);
db.publishers.hasMany(db.placements);

// Placement Brand Safety Providers Relations
db.placement_brand_safety_providers.belongsTo(db.placements);
db.placements.hasMany(db.placement_brand_safety_providers);

// Placement Cpas Relations
db.placement_caps.belongsTo(db.placements);
db.placements.hasMany(db.placement_caps);

// Placement Geo Targets Relations
db.placement_geo_targets.belongsTo(db.placements);
db.placements.hasMany(db.placement_geo_targets);

// Flights relations
db.flights.belongsTo(db.zones);
db.flights.belongsTo(db.accounts);
db.flights.belongsTo(db.advertisers);
db.flights.belongsTo(db.campaigns);
db.zones.hasMany(db.flights);
db.accounts.hasMany(db.flights);
db.advertisers.hasMany(db.flights);
db.campaigns.hasMany(db.flights);

// Flight Brand Safety Providers Relations
db.flight_brand_safety_providers.belongsTo(db.flights);
db.flights.hasMany(db.flight_brand_safety_providers);

// Flight Day Partings Relations
db.flight_day_partings.belongsTo(db.flights);
db.flights.hasMany(db.flight_day_partings);

// Flight Geo Targets Relations
db.flight_geo_targets.belongsTo(db.flights);
db.flights.hasMany(db.flight_geo_targets);

// Flight Goals Relations
db.flight_goals.belongsTo(db.flights);
db.flights.hasMany(db.flight_goals);

// Display Creatives Relations
db.display_creatives.belongsTo(db.zones);
db.display_creatives.belongsTo(db.accounts);
db.display_creatives.belongsTo(db.advertisers);
db.display_creatives.belongsTo(db.campaigns);
db.display_creatives.belongsTo(db.flights);
db.display_creatives.belongsTo(db.video_creatives);
db.zones.hasMany(db.display_creatives);
db.accounts.hasMany(db.display_creatives);
db.advertisers.hasMany(db.display_creatives);
db.campaigns.hasMany(db.display_creatives);
db.flights.hasMany(db.display_creatives);
db.video_creatives.hasMany(db.display_creatives);

// Video Creatives Relations
db.video_creatives.belongsTo(db.zones);
db.video_creatives.belongsTo(db.accounts);
db.video_creatives.belongsTo(db.advertisers);
db.video_creatives.belongsTo(db.campaigns);
db.video_creatives.belongsTo(db.flights);
db.zones.hasMany(db.video_creatives);
db.accounts.hasMany(db.video_creatives);
db.advertisers.hasMany(db.video_creatives);
db.campaigns.hasMany(db.video_creatives);
db.flights.hasMany(db.video_creatives);

module.exports = db;