module.exports = function(sequelize, DataTypes) {
  const PlacementGeoTargets = sequelize.define("placement_geo_targets", {
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
    placement_id: {
      type: DataTypes.INTEGER
    }
  }, {
    freezeTableName: true,
    tableName: 'placement_geo_targets',
    timestamps: false,
    underscored: true
  });

  return PlacementGeoTargets;
};