module.exports = function(sequelize, DataTypes) {
  const Publishers = sequelize.define("publishers", {
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
          msg: 'Publisher name shall be between 6 and 100 characters long.'
        }
      }
    },
    iab_categories: {
      type: DataTypes.ARRAY(DataTypes.STRING)
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
    status: {
      type: DataTypes.ENUM,
      values: ['active', 'disabled']
    },
    zone_id: {
      type: DataTypes.INTEGER
    },
    account_id: {
      type: DataTypes.INTEGER
    }
  }, {
    freezeTableName: true,
    tableName: 'publishers',
    timestamps: false,
    underscored: true
  });

  return Publishers;
};