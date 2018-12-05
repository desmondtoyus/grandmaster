module.exports = function(sequelize, DataTypes) {
  const DisplayCreatives = sequelize.define("display_creatives", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    created_at: {
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    notes: {
      type: DataTypes.STRING
    },
    is_companion_creative: {
      type: DataTypes.BOOLEAN
    },
    filename: {
      type: DataTypes.STRING
    },
    alt_text: {
      type: DataTypes.STRING
    },
    party: {
      type: DataTypes.ENUM,
      values: ['first_party', 'third_party']
    },
    js_tag: {
      type: DataTypes.STRING
    },
    width: {
      type: DataTypes.INTEGER
    },
    height: {
      type: DataTypes.INTEGER
    },
    zone_id: {
      type: DataTypes.INTEGER
    },
    account_id: {
      type: DataTypes.INTEGER
    },
    advertiser_id: {
      type: DataTypes.INTEGER
    },
    campaign_id: {
      type: DataTypes.INTEGER
    },
    flight_id: {
      type: DataTypes.INTEGER
    },
    video_creative_id: {
      type: DataTypes.INTEGER
    }
  }, {
    freezeTableName: true,
    tableName: 'display_creatives',
    timestamps: false,
    underscored: true
  });

  return DisplayCreatives;
};