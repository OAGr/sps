'use strict';

var Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  var Category = sequelize.define('Category', {
    id: {
      type: DataTypes.UUID(),
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    },
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function associate(models) {
        // associations can be defined here
      }
    }
  });
  Category.associate = function (models) {
    Category.Entities = Category.belongsToMany(models.Entity, { through: 'EntityCategory', foreignKey: 'categoryId' });
    Category.Properties = Category.hasMany(models.Property, { as: 'properties', foreignKey: 'categoryId' });
  };
  return Category;
};