'use strict';
const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  var EntityCategory = sequelize.define('EntityCategory', {
    id: {
      type: DataTypes.UUID(),
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCreate: async(entityCategory, options) => {
        const category = await entityCategory.getCategory()
        const abstractProperties = await category.getProperties();
        for (let _property of abstractProperties) {
          await sequelize.models.Property.create({ entityId: entityCategory.entityId, abstractId: _property.id, isAbstract: false })
        }
      }
    }
  });
  EntityCategory.associate = function (models) {
    EntityCategory.Category = EntityCategory.belongsTo(models.Category, {foreignKey: 'categoryId'})
    EntityCategory.Entity = EntityCategory.belongsTo(models.Entity, {foreignKey: 'entityId'})
  }
  return EntityCategory;
};