'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('EntityCategories', {
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
      categoryId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Categories",
          key: "id"
        }
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
    return queryInterface.dropTable('EntityCategories');
  }
};