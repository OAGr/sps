'use strict';
const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  var AggregatedMeasurement = sequelize.define('AggregatedMeasurement', {
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
  AggregatedMeasurement.associate = function (models) {
    AggregatedMeasurement.belongsTo(models.Metric, {foreignKey: 'metricId'})
  }
  return AggregatedMeasurement;
};