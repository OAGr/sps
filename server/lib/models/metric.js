'use strict';
const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  var Metric = sequelize.define('Metric', {
    id: {
      type: DataTypes.UUID(),
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    name: DataTypes.STRING
  });
  Metric.associate = function (models) {
    Metric.hasMany(models.Measurement, { foreignKey: 'metricId' })
    Metric.Measurements = Metric.hasMany(models.Measurement, { foreignKey: 'metricId', as: 'measurements' })
    Metric.hasMany(models.AggregatedMeasurement, { foreignKey: 'metricId' })
    Metric.AggregatedMeasurements = Metric.hasMany(models.AggregatedMeasurement, { foreignKey: 'metricId', as: 'aggregatedMeasurements' })
    Metric.belongsTo(models.User, {foreignKey: 'userId'})
    Metric.User = Metric.belongsTo(models.User, {foreignKey: 'userId'})
  }
  return Metric;
};