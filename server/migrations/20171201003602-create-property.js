// import db from "../models/index"
var DataTypes = require("sequelize")

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
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "Entities",
          key: "id"
        }
      },
      categoryId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "Categories",
          key: "id"
        }
      },
      abstractId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "Properties",
          key: "id"
        }
      },
      name: {
        type: Sequelize.STRING
      },
      isAbstract: {
        type: Sequelize.BOOLEAN
      },
      resolvesAt: {
        type: Sequelize.DataTypes.ARRAY(Sequelize.DATE)
      },
      type: {
        type: Sequelize.ENUM(["EVENT", "PROJECTION", "PROBABILITY"])
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