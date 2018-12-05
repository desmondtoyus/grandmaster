module.exports = function(sequelize, DataTypes) {
  const DomainLists = sequelize.define("domain_lists", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 200],
          msg: 'List name shall be between 6 and 200 characters long.'
        }
      }
    },
    value: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    zone_id: {
      type: DataTypes.INTEGER
    },
    domain_list_type: {
      type: DataTypes.ENUM,
      values: ['domain', 'app_name', 'bundle_id', 'ip_address']
    },
    account_id: {
      type: DataTypes.INTEGER
    }
  }, {
    freezeTableName: true,
    tableName: 'domain_lists',
    timestamps: false,
    underscored: true
  });

  return DomainLists;
};
