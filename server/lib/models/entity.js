'use strict';
const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  var Entity = sequelize.define('Entity', {
    id: {
      type: DataTypes.UUID(),
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    wikipediaUrl: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  Entity.associate = function (models) {
    Entity.Categories = Entity.belongsToMany(models.Category, {through: 'EntityCategory', foreignKey: 'entityId'})
    Entity.Properties = Entity.hasMany(models.Property, {as: 'properties', foreignKey: 'entityId'})
    Entity.Metrics = Entity.hasMany(models.Metric, {as: 'metrics', foreignKey: 'entityId'})
  }
  return Entity;
};