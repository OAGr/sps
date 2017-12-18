'use strict';
const _ = require('lodash');
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
    measurementId: {
      type: DataTypes.UUID,
      allowNull: true 
    },
    mean: DataTypes.FLOAT
  },{
    hooks: {
      beforeCreate: async (aggregatedMeasurement, options) => {
        const metric = await aggregatedMeasurement.getMetric();
        const measurements = await metric.getMeasurements();
        aggregatedMeasurement.mean = _.meanBy(measurements, e => e.dataValues.mean);
      }
    }
  });
  AggregatedMeasurement.associate = function (models) {
    AggregatedMeasurement.Metric = AggregatedMeasurement.belongsTo(models.Metric, {foreignKey: 'metricId'})
    AggregatedMeasurement.Measurement = AggregatedMeasurement.belongsTo(models.Measurement, {foreignKey: 'measurementId'})
  }
  return AggregatedMeasurement;
};