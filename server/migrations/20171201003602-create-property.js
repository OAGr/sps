'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Properties', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      entityId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Entities",
          key: "id"
        }
      },
      abstractPropertyId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "AbstractProperties",
          key: "id"
        }
      },
      value: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Properties');
  }
};