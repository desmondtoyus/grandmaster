module.exports = function(sequelize, DataTypes) {
  const FlightBrandSafetyProviders = sequelize.define("flight_brand_safety_providers", {
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
    flight_id: {
      type: DataTypes.INTEGER
    }
  }, {
    freezeTableName: true,
    tableName: 'flight_brand_safety_providers',
    timestamps: false,
    underscored: true
  });

  return FlightBrandSafetyProviders;
};