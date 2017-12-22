'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Metrics', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      userId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "id"
        }
      },
      propertyId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "Properties",
          key: "id"
        }
      },
      entityId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "Entities",
          key: "id"
        }
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.ENUM(["RESOLVES_AT", "HAPPENS_AT", "FAILURE_CHANCE", "PROBABILITY"])
      },
      resolvesAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      isArchived: {
        defaultValue: false,
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      archivedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Metrics');
  }
};