module.exports = function(sequelize, DataTypes) {
  const Users = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    password: {
      type: DataTypes.STRING
    },
    last_login: {
      type: DataTypes.INTEGER
    },
    created_at: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        len: [7, 100]
      }
    },
    first_name: {
      type: DataTypes.STRING,
      validate: {
        len: [3, 100]
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        len: [3, 100]
      }
    },
    phone_number: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    },
    recover_code: {
      type: DataTypes.STRING
    },
    recover_expire: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.ENUM,
      values: ['active', 'disabled', 'pending', 'inactive']
    },
    zone_id: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    },
    account_id: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    },
    scope_account_id: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    },
    scope_zone_id: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    },
    timezone: {
      type: DataTypes.ENUM,
      values: ['US/Pacific', 'US/Eastern', 'UTC']
    }
  }, {
    freezeTableName: true,
    tableName: 'users',
    timestamps: false,
    underscored: true
  });

  return Users;
};