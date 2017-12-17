import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from "../resolvers";

// Define types
const typeDefs = `
  type Metric {
    id: ID! 
    name: String
    measurements: [Measurement]
  }

  type Measurement {
    id: ID! 
    metricId: ID!
    mean: Float 
    metric: Metric
  }

  type AggregatedMeasurement {
    id: ID! 
    metricId: ID!
    mean: Float 
  }

  type Query {
    metric(id: ID): Metric
    metrics: [Metric]
    measurement(id: ID): Measurement
    measurements: [Measurement]
    aggregatedMeasurement(id: ID): Measurement
    aggregatedMeasurements: [Measurement]
  }

  type Mutation {
    createMetric(name: String!): Metric
    createMeasurement(metricId: ID!, mean: Float): Measurement 
    createAggregatedMeasurement(metricId: ID!, mean: Float): AggregatedMeasurement 
  }
`;

// Generate the schema object from your types definition.
module.exports = makeExecutableSchema({ typeDefs, resolvers });