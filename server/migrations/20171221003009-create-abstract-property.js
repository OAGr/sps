'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AbstractProperties', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      categoryId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "Categories",
          key: "id"
        }
      },
      name: {
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
    return queryInterface.dropTable('AbstractProperties');
  }
};