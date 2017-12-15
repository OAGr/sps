'use strict';
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
    middle: DataTypes.FLOAT
  });
  Measurement.associate = function (models) {
    Measurement.belongsTo(models.Metric, {foreignKey: 'metricId'})
  }
  return Measurement;
};