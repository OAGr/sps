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

let measurementType = new GraphQLObjectType({
  name: 'Measurement',
  description: 'A measurement',
  fields: _.assign(attributeFields(models.Measurement), {
    user: {
      type: userType,
      resolve: resolver(models.Metric.User, {
        separate: false
      })
    },
  })
});

let aggregatedMeasurementType = new GraphQLObjectType({
  name: 'AggregatedMeasurement',
  description: 'A aggregated measurement',
  fields: attributeFields(models.AggregatedMeasurement)
});

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
          }
        },
        description: 'Creates a new metric',
        resolve: async (__, { name }) => {
          // const user = await models.User.create({ name: "Ozzie", email: "foo@bar.com" })
          return models.Metric.create({ name, userId: "78532f77-a1ec-45fd-8e00-51c881882253" })
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
          const newMetric = await models.Measurement.create({ mean, metricId, userId: "78532f77-a1ec-45fd-8e00-51c881882253"  })
          const existingMeasurements = await models.Measurement.findAll({where: {metricId}})
          const aggregatedMean = _.meanBy(existingMeasurements, e => e.dataValues.mean);
          const aggregated = await models.AggregatedMeasurement.create({ metricId, mean: aggregatedMean })
          return newMetric
        }
      }
    }
  })
});

export {schema};