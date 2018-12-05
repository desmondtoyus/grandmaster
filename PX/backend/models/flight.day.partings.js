module.exports = function(sequelize, DataTypes) {
  const FlightDayPartings = sequelize.define("flight_day_partings", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    start_day: {
      type: DataTypes.ENUM,
      values: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    end_day: {
      type: DataTypes.ENUM,
      values: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    start_hour: {
      type: DataTypes.INTEGER
    },
    end_hour: {
      type: DataTypes.INTEGER
    },
    flight_id: {
      type: DataTypes.INTEGER
    }
  }, {
    freezeTableName: true,
    tableName: 'flight_day_partings',
    timestamps: false,
    underscored: true
  });

  return FlightDayPartings;
};