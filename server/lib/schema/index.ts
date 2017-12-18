var models = require('../models');
import * as _ from 'lodash';
import { resolver, attributeFields } from 'graphql-sequelize';
import { GraphQLObjectType, GraphQLNonNull, GraphQLFloat, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { GraphQLBoolean } from 'graphql/type/scalars';

let userType = new GraphQLObjectType({
  name: 'User',
  description: 'A user',
  fields: attributeFields(models.User)
});

let aggregatedMeasurementType = new GraphQLObjectType({
  name: 'AggregatedMeasurement',
  description: 'A aggregated measurement',
  fields: attributeFields(models.AggregatedMeasurement)
});

let measurementType = new GraphQLObjectType({
  name: 'Measurement',
  description: 'A measurement',
  fields: _.assign(attributeFields(models.Measurement), {
    user: {
      type: userType,
      resolve: resolver(models.Measurement.User, {
        separate: false
      })
    },
    aggregatedMeasurement: {
      type: aggregatedMeasurementType,
      resolve: resolver(models.Measurement.AggregatedMeasurement, {
        separate: false
      })
    },
  })
});

const defaultUserId = "3aba1235-d5d6-4e52-b9c6-a0a95d1ee8ab";

let metricType = new GraphQLObjectType({
  name: 'Metric',
  description: 'A user',
  fields: _.assign(attributeFields(models.Metric), {
    user: {
      type: userType,
      resolve: resolver(models.Metric.User, {
        separate: false
      })
    },
    measurements: {
      type: new GraphQLList(measurementType),
      resolve: resolver(models.Metric.Measurements, {
        separate: false
      })
    },
    aggregatedMeasurements: {
      type: new GraphQLList(aggregatedMeasurementType),
      resolve: resolver(models.Metric.AggregatedMeasurements, {
        separate: false
      })
    }
  })
});

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      metric: {
        type: metricType,
        args: {
          id: {
            description: 'id of the user',
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve: resolver(models.Metric)
      },
      metrics: {
        type: new GraphQLList(metricType),
        args: {
          limit: {
            type: GraphQLInt
          },
          order: {
            type: GraphQLString
          }
        },
        resolve: resolver(models.Metric)
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      createMetric: {
        type: metricType,
        args: {
          name: {
            description: 'A name',
            type: new GraphQLNonNull(GraphQLString)
          },
          description: {
            description: 'A name',
            type: GraphQLString
          },
          resolvesAt: {
            description: 'A name',
            type: GraphQLString
          },
        },
        description: 'Creates a new metric',
        resolve: async (__, { name, description }) => {
          // const user = await models.User.create({ name: "george"})
          console.log(name, description)
          return models.Metric.create({ name, description, resolvesAt: '2030-08-09 04:05:02', userId: defaultUserId, isArchived: false })
        }
      },
      createMeasurement: {
        type: measurementType,
        args: {
          mean: {
            description: 'A measurement',
            type: new GraphQLNonNull(GraphQLFloat)
          },
          metricId: {
            description: 'A measurement',
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        description: 'Creates a new measurement',
        resolve: async (__, { mean, metricId }) => {
          const newMetric = await models.Measurement.create({ mean, metricId, userId: defaultUserId  })
          return newMetric
        }
      }
    }
  })
});

export {schema};