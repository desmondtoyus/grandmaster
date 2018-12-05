module.exports = function(sequelize, DataTypes) {
  const Placements = sequelize.define("placements", {
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
          msg: "Placement name shall be between 6 and 100 characters long."
        }
      }
    },
    notes: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [0, 500],
          msg: "Notes shall be at most 500 characters long."
        }
      }
    },
    status: {
      type: DataTypes.ENUM,
      values: ["live", "paused", "disabled", 'complete']
    },
    cpm: {
      type: DataTypes.INTEGER
    },
    cpc: {
      type: DataTypes.INTEGER
    },
    bwa_cpm: {
      type: DataTypes.INTEGER
    },
    is_revshare: {
      type: DataTypes.BOOLEAN
    },
    publisher_revenue_share: {
      type: DataTypes.INTEGER
    },
    width: {
      type: DataTypes.INTEGER
    },
    height: {
      type: DataTypes.INTEGER
    },
    bwa_video_player_volume: {
      type: DataTypes.INTEGER
    },
    bwa_player_type:{
      type: DataTypes.ENUM,
      values: ["standard", "slider", "in_article", "in_article_fixed"]
    },
    max_video_duration: {
      type: DataTypes.INTEGER
    },
    app_store_url: {
      type: DataTypes.STRING
    },
    bwa_video_player_width: {
      type: DataTypes.INTEGER
    },
    bwa_video_player_height: {
      type: DataTypes.INTEGER
    },
    player_size: {
      type: DataTypes.ENUM,
      values: ["small", "medium", "large", "n/a"]
    },
    demand_prioritization_type: {
      type: DataTypes.ENUM,
      values: ['user_defined', 'price', 'random']
    },
    iab_categories: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },

    demand_list: {
      type: DataTypes.ARRAY(DataTypes.INTEGER)
    },
    optimizer: {
      type: DataTypes.ENUM,
      values: ["cpm", "order"]
    },
    is_vast_only: {
      type: DataTypes.BOOLEAN
    },
    has_bwa_video_player: {
      type: DataTypes.BOOLEAN
    },
    format: {
      type: DataTypes.ENUM,
      values: ["display", "video"]
    },
    channel: {
      type: DataTypes.ENUM,
      values: ["mobile_web", "mobile_app", "ctv", "desktop"]
    },
    timezone: {
      type: DataTypes.ENUM,
      values: ["UTC", "US/Pacific", "US/Eastern"]
    },
    zone_id: {
      type: DataTypes.INTEGER
    },
    account_id: {
      type: DataTypes.INTEGER
    },
    publisher_id: {
      type: DataTypes.INTEGER
    },
    passback_url: {
      type: DataTypes.STRING
    },
    domain_list_id: {
      type: DataTypes.INTEGER
    },
    domain_list_category: {
      type: DataTypes.ENUM,
      values: ['whitelist', 'blacklist', 'none']
    },
    ip_list_id: {
      type: DataTypes.INTEGER
    },
    ip_list_category : {
      type: DataTypes.ENUM,
      values: ['whitelist', 'blacklist', 'none']
    },
    // 
    default_domain: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [0, 100],
          msg: "Notes shall be at most 500 characters long."
        }
      }
    },
    default_app_name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [0, 100],
          msg: "Notes shall be at most 500 characters long."
        }
      }
    },
    default_bundle_id: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [0, 100],
          msg: "Notes shall be at most 500 characters long."
        }
      }
    },
    default_ctv_channel: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [0, 100],
          msg: "Notes shall be at most 500 characters long."
        }
      }
    },
    // 
    
    pricing_model: {
      type: DataTypes.ENUM,
      values: ['cpm', 'cpc', 'revshare']
    }
  }, {
    freezeTableName: true,
    tableName: 'placements',
    timestamps: false,
    underscored: true
  });

  return Placements;
};