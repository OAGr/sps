'use strict';
const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  var Property = sequelize.define('Property', {
    id: {
      type: DataTypes.UUID(),
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    abstractPropertyId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    value: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  Property.associate = function (models) {
    // Property.Entity = Property.belongsTo(models.AbstractProperty, { foreignKey: 'entityId', as: 'entity' })
    // Property.AbstractProperty = Property.belongsTo(models.AbstractProperty, { foreignKey: 'abstractPropertyId', as: 'abstractProperties' })
    // Property.Metrics = Property.hasMany(models.Metric, { foreignKey: 'propertyId', as: 'metrics' })
  }
  return Property;
};