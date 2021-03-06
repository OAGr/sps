'use strict';

var Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  var EntityCategory = sequelize.define('EntityCategory', {
    id: {
      type: DataTypes.UUID(),
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  });
  return EntityCategory;
};