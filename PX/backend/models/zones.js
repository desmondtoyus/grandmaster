module.exports = function(sequelize, DataTypes) {
  const Zones = sequelize.define("zones", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    created_at: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING
    }
  }, {
      freezeTableName: true,
      tableName: 'zones',
      timestamps: false,
      underscored: true
  });

  return Zones;
};