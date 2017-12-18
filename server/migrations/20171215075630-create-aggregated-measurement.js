'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AggregatedMeasurements', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      metricId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Metrics",
          key: "id"
        }
      },
      measurementId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "Measurements",
          key: "id"
        }
      },
      mean: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('AggregatedMeasurements');
  }
};