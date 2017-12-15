'use strict';
module.exports = (sequelize, DataTypes) => {
  var AggregatedMeasurement = sequelize.define('AggregatedMeasurement', {
    id: {
      type: DataTypes.UUID(),
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    middle: DataTypes.FLOAT
  });
  Measurement.associate = function (models) {
    Measurement.belongsTo(models.Metric, {foreignKey: 'metricId'})
  }
  return AggregatedMeasurement;
};