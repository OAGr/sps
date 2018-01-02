var models = require('../models');
import * as _ from 'lodash';
import { resolver, attributeFields } from 'graphql-sequelize';
import { GraphQLObjectType, GraphQLNonNull, GraphQLFloat, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLInputObjectType } from 'graphql';
import { GraphQLBoolean } from 'graphql/type/scalars';
import * as aasync from "async";
// console.log(aasync)

const generateReferences = (model, references) => {
  let all = {};
  references.map(r => {
    all[r[0]] = {
      type: r[1](),
      resolve: resolver(model[r[2]])
    }
  })
  return all
}

const makeObjectType = (model, references) => (
  new GraphQLObjectType({
    name: model.name,
    description: model.name,
    fields: () => _.assign(attributeFields(model), generateReferences(model, references))
  })
)

let userType = makeObjectType(models.User,
  [['metrics', () => metricType, 'Metrics']]
)

let aggregatedMeasurementType = makeObjectType(models.AggregatedMeasurement, [])

let measurementType = makeObjectType(models.Measurement, [
  ['user', () => userType, 'User'],
  ['aggregatedMeasurement', () => aggregatedMeasurementType, 'AggregatedMeasurement']
])

let metricType = makeObjectType(models.Metric, [
  ['user', () => userType, 'User'],
  ['entity', () => entityType, 'Entity'],
  ['property', () => propertyType, 'Property'],
  ['measurements', () => new GraphQLList(measurementType), 'Measurements'],
  ['aggregatedMeasurements', () => new GraphQLList(aggregatedMeasurementType), 'AggregatedMeasurements']
])

let entityType = makeObjectType(models.Entity, [
  ['categories', () => new GraphQLList(categoryType), 'Categories'],
  ['properties', () => new GraphQLList(propertyType), 'Properties'],
  ['metrics', () => new GraphQLList(metricType), 'Metrics'],
])

let categoryType = makeObjectType(models.Category, [
  ['entities', () => new GraphQLList(entityType), 'Entities'],
  ['properties', () => new GraphQLList(propertyType), 'Properties'],
])

let propertyType = makeObjectType(models.Property, [
  ['entity', () => entityType, 'Entity'],
  ['category', () => categoryType, 'Category'],
  ['metrics', () => new GraphQLList(metricType), 'Metrics'],
  ['abstractProperty', () => propertyType, 'AbstractProperty'],
])

// ENTITY -------------------------------
const defaultUserId = "edfa7c14-2b34-45c0-bad2-1c0b994dac11";
const entityArgs = {..._.pick(attributeFields(models.Entity), ['name', 'description', 'image', 'wikipediaUrl']), ...{categoryIds: {type: new GraphQLList(GraphQLString)}}}

const EntityInput = new GraphQLInputObjectType({
  name: "entityInput",
  fields: entityArgs
})
const EntityInputs = new GraphQLList(EntityInput)

async function createEntity({ name, description, image, wikipediaUrl, categoryIds }){
    let newEntity = await models.Entity.create({ name, description, image, wikipediaUrl})
    return await Promise.all(categoryIds.map(async id => {
     const category = await models.Category.findById(id)
     if (category) {
       await models.EntityCategory.create({ entityId: newEntity.id, categoryId: id })
     }
    }))

    newEntity = await models.Entity.findById(newEntity.id)
    return newEntity
}

// Property -------------------------------
const propertyArgs = {..._.pick(attributeFields(models.Property), ['name', 'categoryId', 'entityId', 'resolvesAt'])}
const PropertyInput = new GraphQLInputObjectType({
  name: "propertyInput",
  fields: propertyArgs
})

const PropertyInputs = new GraphQLList(PropertyInput)

async function upsert(model, params){
  if (params.id) {
    const result = await model.update(params, {where: {id: params.id}, returning: true})
    return result[1][0];
  } else {
    return await model.create(params)
  }
}

async function upsertt(model, params){
  let result
  if (params.id) {
    result = await model.update(params, {where: {id: params.id}, returning: true})
    result = result[1][0];
  } else {
    result = await model.create(params)
  }
  return result
}

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      metric: {
        type: metricType,
        args: _.pick(attributeFields(models.Metric), ['id']),
        resolve: resolver(models.Metric)
      },
      metrics: {
        type: new GraphQLList(metricType),
        resolve: resolver(models.Metric)
      },
      categories: {
        type: new GraphQLList(categoryType),
        resolve: resolver(models.Category)
      },
      entities: {
        type: new GraphQLList(entityType),
        resolve: resolver(models.Entity)
      },
      entity: {
        type: entityType,
        args: _.pick(attributeFields(models.Entity), ['id']),
        resolve: resolver(models.Entity)
      },
      properties: {
        type: new GraphQLList(propertyType),
        resolve: resolver(models.Property)
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      createMetric: {
        type: metricType,
        args: _.pick(attributeFields(models.Metric), ['name', 'description', 'resolvesAt']),
        resolve: async (__, { name, description, resolvesAt }) => {
          return models.Metric.create({ name, description, resolvesAt, isArchived: false })
        }
      },
      createMeasurement: {
        type: measurementType,
        args: _.pick(attributeFields(models.Measurement), ['mean', 'metricId']),
        resolve: async (__, { mean, metricId }) => {
          const newMetric = await models.Measurement.create({ mean, metricId, userId: defaultUserId })
          return newMetric
        }
      },
      createEntity: {
        type: entityType,
        args: entityArgs,
        resolve: async (__, params) => createEntity(params)
      },
      createEntities: {
        type: new GraphQLList(entityType),
        args: {entities: {type: EntityInputs}},
        resolve: async (__, { entities }) => {
          return await Promise.all(entities.map(e => createEntity(e)))
        }
      },
      upsertCategory: {
        type: categoryType,
        args: {..._.pick(attributeFields(models.Category), ['name']), id: {type: GraphQLString}},
        resolve: async (__, params) => upsert(models.Category, params)
      },
      upsertProperty: {
        type: propertyType,
        args: {..._.pick(attributeFields(models.Property), ['name', 'categoryId', 'entityId', 'resolvesAt']), id: {type: GraphQLString}},
        resolve: async (__, params) => upsert(models.Property, params)
      },
      upsertProperties: {
        type: new GraphQLList(propertyType),
        args: {properties: {type: PropertyInputs}},
        resolve: async (__, { properties }) => {
          return await Promise.all(properties.map(p => upsert(models.Property, p)))
        }
      }
    }
  })
});

export {schema};