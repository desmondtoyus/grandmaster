module.exports = function(sequelize, DataTypes) {
  const Accounts = sequelize.define("accounts", {
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
          args: [6, 200],
          msg: 'Account name shall be between 6 and 200 characters long.'
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
    status: {
      type: DataTypes.ENUM,
      values: ["active", "disabled", "pending", "inactive"]
    },
    approved_at: {
      type: DataTypes.INTEGER
    },
    zone_id: {
      type: DataTypes.INTEGER
    },
    is_zone_master: {
      type: DataTypes.BOOLEAN
    }
  }, {
    freezeTableName: true,
    tableName: 'accounts',
    timestamps: false,
    underscored: true
  });

  return Accounts;
};