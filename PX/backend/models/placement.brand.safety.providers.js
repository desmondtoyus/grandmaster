module.exports = function(sequelize, DataTypes) {
  const PlacementBrandSafetyProviders = sequelize.define("placement_brand_safety_providers", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    },
    is_active: {
      type: DataTypes.BOOLEAN
    },
    placement_id: {
      type: DataTypes.INTEGER
    }
  }, {
    freezeTableName: true,
    tableName: 'placement_brand_safety_providers',
    timestamps: false,
    underscored: true
  });

  return PlacementBrandSafetyProviders;
};