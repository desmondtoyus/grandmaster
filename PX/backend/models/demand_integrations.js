module.exports = function (sequelize, DataTypes) {
    const Demand_integrations = sequelize.define("demand_integrations", {
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
                    args: [2, 100],
                    msg: 'Integration name shall be between 6 and 100 characters long.'
                }
            }
        },
        value: {
            type: DataTypes.INTEGER
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
        }
    }, {
            freezeTableName: true,
            tableName: 'demand_integrations',
            timestamps: false,
            underscored: true
        });

    return Demand_integrations;
};