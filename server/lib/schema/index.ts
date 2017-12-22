var models = require('../models');
import * as _ from 'lodash';
import { resolver, attributeFields } from 'graphql-sequelize';
import { GraphQLObjectType, GraphQLNonNull, GraphQLFloat, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { GraphQLBoolean } from 'graphql/type/scalars';

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
  ['property', () => propertyType, 'Property'],
  ['measurements', () => new GraphQLList(measurementType), 'Measurements'],
  ['aggregatedMeasurements', () => new GraphQLList(aggregatedMeasurementType), 'AggregatedMeasurements']
])

let entityType = makeObjectType(models.Entity, [
  ['categories', () => new GraphQLList(categoryType), 'Categories'],
  ['properties', () => new GraphQLList(propertyType), 'Properties'],
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

const defaultUserId = "3aba1235-d5d6-4e52-b9c6-a0a95d1ee8ab";
// var i = 0;
// setInterval(() => {
//   var bar = models;
//   console.log(bar)
// 	console.log('hello world:' + i++);
//   debugger;
// }, 1000);

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
      }
    }
  })
});

export {schema};