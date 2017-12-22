'use strict';
const Sequelize = require('sequelize')

async function withAbstractBackup(item, property) {
  if (!item.dataValues[property] && item.dataValues.abstractId){
    const abstractProperty = await item.getAbstractProperty();
    return abstractProperty.dataValues[property]
  }
  else {
    return item.dataValues[property]
  }
}

module.exports = (sequelize, DataTypes) => {
  var Property = sequelize.define('Property', {
    id: {
      type: DataTypes.UUID(),
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: true 
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true 
    },
    abstractId: {
      type: DataTypes.UUID,
      allowNull: true 
    },
    name: {
      type: Sequelize.STRING,
      get: async function() {
        return await withAbstractBackup(this, 'name')
      }
    },
    isAbstract: {
      type: Sequelize.BOOLEAN
    },
    resolvesAt: {
      type: Sequelize.DataTypes.ARRAY(Sequelize.DATE),
      get: async function() {
        return await withAbstractBackup(this, 'resolvesAt')
      }
    },
    type: {
      type: Sequelize.ENUM(["EVENT", "PROJECTION", "PROBABILITY"]),
      get: async function() {
        return await withAbstractBackup(this, 'type')
      }
    }
  })
  Property.prototype.generateMetrics = async function(){
      const resolvesAt = await this.resolvesAt;
      await Promise.all(resolvesAt.map(async (r) => {await this.createMetric({resolvesAt: r})}))
  }
  Property.afterCreate(p => {
    if (!p.isAbstract){
      p.generateMetrics()
    }
  })
  Property.associate = function (models) {
    Property.Entity = Property.belongsTo(models.Entity, { foreignKey: 'entityId', as: 'entity' })
    Property.Category = Property.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' })
    Property.Metrics = Property.hasMany(models.Metric, { foreignKey: 'propertyId', as: 'metrics' })
    Property.AbstractProperty = Property.belongsTo(models.Property, { foreignKey: 'abstractId', as: 'abstractProperty' })
  }
  return Property;
};