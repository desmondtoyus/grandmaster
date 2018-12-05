module.exports = function(sequelize, DataTypes) {
  const Campaigns = sequelize.define("campaigns", {
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
          msg: 'Campaign name shall be between 6 and 100 characters long.'
        }
      }
    },
    notes: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [0, 500],
          msg: 'Notes shall be at most 500 characters long.'
        }
      }
    },
    start_time: {
      type: DataTypes.INTEGER
    },
    end_time: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.ENUM,
      values: ["live", "paused", "disabled", "complete"]
    },
    day_impression_goal: {
      type: DataTypes.INTEGER
    },
    total_impression_goal: {
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
    timezone: {
      type: DataTypes.ENUM,
      values: ['US/Pacific', 'US/Eastern', 'UTC']
    }
  }, {
    freezeTableName: true,
    tableName: 'campaigns',
    timestamps: false,
    underscored: true
  });

  return Campaigns;
};