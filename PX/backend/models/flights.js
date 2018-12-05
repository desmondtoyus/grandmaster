module.exports = function(sequelize, DataTypes) {
  const Flights = sequelize.define("flights", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    created_at: {
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 100],
          msg: "Flight name shall be between 6 and 100 characters long"
        }
      }
    },
    notes: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [0, 500],
          msg: "Notres shall be at most 500 characters long."
        }
      }
    },
    cpm: {
      type: DataTypes.INTEGER
    },
    cpc: {
      type: DataTypes.INTEGER
    },
    clickthrough_url: {
      type: DataTypes.STRING
    },
    impression_tracker: {
      type: DataTypes.STRING
    },
    click_tracker: {
      type: DataTypes.STRING
    },
    wrapper_url: {
      type: DataTypes.STRING
    },
    wrapper_source_platform: {
      type: DataTypes.STRING
    },
    is_direct_deal: {
      type: DataTypes.BOOLEAN
    },
    is_retargeted: {
      type: DataTypes.BOOLEAN
    },
    direct_deal_ids: {
      type: DataTypes.ARRAY(DataTypes.INTEGER)
    },
    user_frequency_cap: {
      type: DataTypes.INTEGER
    },
    is_muted_allowed: {
      type: DataTypes.BOOLEAN
    },
    is_visible_only: {
      type: DataTypes.BOOLEAN
    },
    is_vast_only: {
      type: DataTypes.BOOLEAN
    },
    start_time: {
      type: DataTypes.INTEGER
    },
    end_time: {
      type: DataTypes.INTEGER
    },
    demand_source_type: {
      type: DataTypes.ENUM,
      values: ['standard', 'rtb', 'deal_id']
    },
    flight_type:{
      type: DataTypes.ENUM,
      values: ['first_party', 'third_party', 'rtb']
    },
    pacing_category: {
      type: DataTypes.ENUM,
      values: ['even', 'asap']
    },
    user_agent: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    desktop_browser_targeting: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    rtb_source: {
      type: DataTypes.INTEGER
    },
    format: {
      type: DataTypes.ENUM,
      values: ['display', 'video']
    },
    max_video_duration : {
      type: DataTypes.INTEGER
    },
    channel: {
      type: DataTypes.ENUM,
      values: ['mobile_web', 'mobile_app', 'ctv', 'desktop']
    },
    vast_document: {
      type: DataTypes.STRING
    },
    wrapper_vast: {
      type: DataTypes.STRING
    },
    timezone: {
      type: DataTypes.ENUM,
      values: ['UTC', 'US/Pacific', 'US/Eastern']
    },
    height: {
      type: DataTypes.INTEGER
    },
    width: {
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
    status: {
      type: DataTypes.ENUM,
      values: ['active', 'inactive', 'disabled', 'capped', 'complete']
    },
    iab_categories: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    player_size: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    domain_list_id: {
      type: DataTypes.INTEGER
    },
    deal_cpmfloor: {
      type: DataTypes.INTEGER
    },
    deal_id: {
      type: DataTypes.STRING
    },
    is_skippable: {
      type: DataTypes.ENUM,
      values: ['none', '5 Seconds', '15 Seconds']
    },
    domain_list_category: {
      type: DataTypes.ENUM,
      values: ['none', 'whitelist', 'blacklist']
    },
    ip_list_id: {
      type: DataTypes.INTEGER
    },
    ip_list_category: {
      type: DataTypes.ENUM,
      values: ['whitelist', 'blacklist', 'none']
    },
    companion_clickthrough_url: {
      type: DataTypes.STRING
    }
  }, {
    freezeTableName: true,
    tableName: 'flights',
    timestamps: false,
    underscored: true
  });

  return Flights;
};