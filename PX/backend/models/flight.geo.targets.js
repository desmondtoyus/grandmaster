module.exports = function(sequelize, DataTypes) {
  const FlightGeoTargets = sequelize.define("flight_geo_targets", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    is_include: {
      type: DataTypes.BOOLEAN
    },
    country: {
      type: DataTypes.STRING
    },
    province: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    dma: {
      type: DataTypes.STRING
    },
    postal_code: {
      type: DataTypes.STRING
    },
    flight_id: {
      type: DataTypes.INTEGER
    }
  }, {
    freezeTableName: true,
    tableName: 'flight_geo_targets',
    timestamps: false,
    underscored: true
  });

  return FlightGeoTargets;
};