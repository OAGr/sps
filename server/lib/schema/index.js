var models = require('../models');
import * as _ from 'lodash';
import { resolver, attributeFields } from 'graphql-sequelize';
import { GraphQLObjectType, GraphQLNonNull, GraphQLFloat, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLInputObjectType } from 'graphql';
import { GraphQLBoolean } from 'graphql/type/scalars';
import * as aasync from "async";
import * as pluralize from "pluralize";
import * as Case from "Case";
// console.log(aasync)

const defaultUserId = "edfa7c14-2b34-45c0-bad2-1c0b994dac11";

async function updateModel(model, params){
    const result = await model.update(params, {where: {id: params.id}, returning: true})
    return result[1][0];
}

async function upsert(model, params){
  if (params.id) {
    return await updateModel(model, params)
  } else {
    return await model.create(params)
  }
}

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

// ENTITY STUFF
let entityType = makeObjectType(models.Entity, [
  ['categories', () => new GraphQLList(categoryType), 'Categories'],
  ['properties', () => new GraphQLList(propertyType), 'Properties'],
  ['metrics', () => new GraphQLList(metricType), 'Metrics'],
])

const entityArgs = {
  ..._.pick(attributeFields(models.Entity), ['name', 'description', 'image', 'wikipediaUrl']), 
  ...{categoryIds: {type: new GraphQLList(GraphQLString)}},
  id: {type: GraphQLString},
}

const EntityInput = new GraphQLInputObjectType({
  name: "entityInput",
  fields: entityArgs
})
const EntityInputs = new GraphQLList(EntityInput)

async function createEntity({ name, description, image, wikipediaUrl, categoryIds }){
    let newEntity = await models.Entity.create({ name, description, image, wikipediaUrl})
    await Promise.all((categoryIds || []).map(async id => {
       const category = await models.Category.findById(id)
       if (category) {
         await models.EntityCategory.create({ entityId: newEntity.id, categoryId: id })
       }
    }))

    return await models.Entity.findById(newEntity.id)
    // return newEntity
}

async function upsertEntity(params){
  if (params.id){
    return await updateModel(models.Entity, params)
  } else {
    return await createEntity(params)
  }
}


let categoryType = makeObjectType(models.Category, [
  ['entities', () => new GraphQLList(entityType), 'Entities'],
  ['properties', () => new GraphQLList(propertyType), 'Properties'],
])

// Property -------------------------------
let propertyType = makeObjectType(models.Property, [
  ['entity', () => entityType, 'Entity'],
  ['category', () => categoryType, 'Category'],
  ['metrics', () => new GraphQLList(metricType), 'Metrics'],
  ['abstractProperty', () => propertyType, 'AbstractProperty'],
])

const propertyArgs = {..._.pick(attributeFields(models.Property), ['name', 'categoryId', 'entityId', 'resolvesAt'])}
const PropertyInput = new GraphQLInputObjectType({
  name: "propertyInput",
  fields: propertyArgs
})

const PropertyInputs = new GraphQLList(PropertyInput)

function standardUpserts(name, existingAttributes, type){
  const modelName = models[Case.sentence(name)]
  const objectArgs = {
    ..._.pick(attributeFields(modelName), existingAttributes),
    id: {type: GraphQLString},
  }

  const singleInput = new GraphQLInputObjectType({
    name: `${name}Input`,
    fields: objectArgs 
  })

  const multipleInput = new GraphQLList(singleInput)

  let upserts = {}
  upserts[`upsert${Case.sentence(name)}`] = {
    type,
    args: objectArgs,
    resolve: async (__, params) => await upsert(modelName, params)
  }

  let pluralArgs = {};
  pluralArgs[pluralize.plural(name)] = {type: multipleInput}
  upserts[`upsert${Case.sentence(pluralize.plural(name))}`] = {
    type: new GraphQLList(type),
    args: pluralArgs,
    resolve: async (__, params) => await upsert(modelName, params)
  }
  return upserts
}

const propertyMutations = standardUpserts("property", ['name', 'categoryId', 'entityId', 'resolvesAt'], propertyType)
const categoryMutations = standardUpserts("category", ['name'], categoryType)

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
      upsertEntity: {
        type: entityType,
        args: entityArgs,
        resolve: async (__, params) => await upsertEntity(params)
      },
      upsertEntities: {
        type: new GraphQLList(entityType),
        args: {entities: {type: EntityInputs}},
        resolve: async (__, { entities }) => {
          return await Promise.all(entities.map(e => createEntity(e)))
        }
      },
      ...propertyMutations,
      ...categoryMutations,
    }
  })
});

export {schema};