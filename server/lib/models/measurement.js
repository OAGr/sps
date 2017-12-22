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
    mean: {
      type: DataTypes.FLOAT,
    }
  },{
    hooks: {
      afterCreate: async (measurement, options) => {
        await sequelize.models.AggregatedMeasurement.create({ metricId: measurement.metricId, measurementId: measurement.id, mean: 30})
      }
    }
  });
  Measurement.associate = function (models) {
    Measurement.Metric = Measurement.belongsTo(models.Metric, {foreignKey: 'metricId'})
    Measurement.User = Measurement.belongsTo(models.User, {foreignKey: 'userId'})
    Measurement.AggregatedMeasurement = Measurement.hasOne(models.AggregatedMeasurement, { foreignKey: 'measurementId', as: 'aggregatedMeasurement' })
  }
  return Measurement;
};