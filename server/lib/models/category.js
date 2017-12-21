'use strict';
const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define('Category', {
    id: {
      type: DataTypes.UUID(),
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  Category.associate = function (models) {
    Category.Entities = Category.belongsToMany(models.Entity, {through: 'EntityCategory', foreignKey: 'categoryId'})
    Category.AbstractProperties = Category.hasMany(models.AbstractProperty, {as: 'abstractProperties', foreignKey: 'categoryId'})
  }
  return Category;
};