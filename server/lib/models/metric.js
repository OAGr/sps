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
    userId: {
      type: DataTypes.UUID(),
      allowNull: true,
    },
    propertyId: {
      type: DataTypes.UUID(),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      get: async function() {
        if (!!this.dataValues.name) { return this.dataValues.name } 
        const p = await this.getProperty()
        const pName = await p.name;
        const e = await p.getEntity()
        return `${e.name}-${pName}`
      }
    },
    description: DataTypes.TEXT,
    resolvesAt: DataTypes.DATE,
    isArchived: DataTypes.BOOLEAN
  });
  Metric.associate = function (models) {
    Metric.Measurements = Metric.hasMany(models.Measurement, { foreignKey: 'metricId', as: 'measurements' })
    Metric.AggregatedMeasurements = Metric.hasMany(models.AggregatedMeasurement, { foreignKey: 'metricId', as: 'aggregatedMeasurements' })
    Metric.User = Metric.belongsTo(models.User, {foreignKey: 'userId'})
    Metric.Property = Metric.belongsTo(models.Property, {foreignKey: 'propertyId'})
  }
  return Metric;
};