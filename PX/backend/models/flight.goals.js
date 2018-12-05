module.exports = function(sequelize, DataTypes) {
  const FlightGoals = sequelize.define("flight_goals", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    impressions: {
      type: DataTypes.INTEGER
    },
    interval: {
      type: DataTypes.ENUM,
      values: ['day', 'total']
    },
    flight_id: {
      type: DataTypes.INTEGER
    },
    is_budget: {
      type: DataTypes.BOOLEAN
    },
    current_impression_count: {
      type: DataTypes.INTEGER
    }
  }, {
    freezeTableName: true,
    tableName: 'flight_goals',
    timestamps: false,
    underscored: true
  });

  return FlightGoals;
};