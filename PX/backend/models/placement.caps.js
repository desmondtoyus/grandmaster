module.exports = function(sequelize, DataTypes) {
  const PlacementCaps = sequelize.define("placement_caps", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    opportunities: {
      type: DataTypes.INTEGER
    },
    interval: {
      type: DataTypes.ENUM,
      values: ["day", "total"]
    },
    start_time: {
      type: DataTypes.INTEGER
    },
    end_time: {
      type: DataTypes.INTEGER
    },
    placement_id: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.ENUM,
      values: ['active', 'complete']
    },
    current_opportunity_count: {
      type: DataTypes.INTEGER
    }
  }, {
    freezeTableName: true,
    tableName: 'placement_caps',
    timestamps: false,
    underscored: true
  });

  return PlacementCaps;
};