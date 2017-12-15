'use strict';
const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  var Measurement = sequelize.define('Measurement', {
    id: {
      type: DataTypes.UUID(),
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    metricId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    mean: DataTypes.FLOAT
  });
  Measurement.associate = function (models) {
    Measurement.belongsTo(models.Metric, {foreignKey: 'metricId'})
  }
  return Measurement;
};