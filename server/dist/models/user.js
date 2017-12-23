'use strict';

var Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID(),
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    },
    name: DataTypes.STRING
  });
  User.associate = function (models) {
    User.Metrics = User.hasMany(models.Metric, { foreignKey: 'userId', as: 'metrics' });
    User.Measurements = User.hasMany(models.Measurement, { foreignKey: 'userId', as: 'measurements' });
  };
  return User;
};