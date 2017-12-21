'use strict';
const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  var AbstractProperty = sequelize.define('AbstractProperty', {
    id: {
      type: DataTypes.UUID(),
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true 
    },
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  AbstractProperty.associate = function (models) {
    AbstractProperty.Category = AbstractProperty.belongsTo(models.Category, {foreignKey: 'categoryId', as: 'category'})
    AbstractProperty.Properties = AbstractProperty.hasMany(models.Property, {foreignKey: 'abstractPropertyId', as: 'properties'})
  }
  return AbstractProperty;
};