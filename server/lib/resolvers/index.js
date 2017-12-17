import * as _ from "lodash";
import {resolver} from 'graphql-sequelize';
import db from "../models/index"

const Query = {
   metric: resolver(db.Metric),
   metrics: resolver(db.Metric, {
       list: true
   }),
   measurement: resolver(db.Measurement),
   measurements: resolver(db.Measurement, {
       list: true
   }),
//    measurement: async (_, data) => {
//     const item = await db.Measurement.findOne({id: data.id})
//     return item.dataValues
//    },
//    measurement: resolver(db.Measurement),
//    measurements: async (_, data) => {
//     const items = await db.Measurement.findAll({})
//     return items.map(e => e.dataValues)
//    },
   aggregatedMeasurement: resolver(db.AggregatedMeasurement),
   aggregatedMeasurement: resolver(db.AggregatedMeasurement, {
       list: true
   }),
};

async function createMetric(name){
    const metric = await db.Metric.create({name})
    return metric.dataValues
}

const Mutation = {
    createMetric: async (_, data) => {
        const metric = await db.Metric.create({name: data.name})
        return metric.dataValues
    },
    createMeasurement: async (_, data) => {
        const {metricId, mean} = data;
        const measurement = await db.Measurement.create({metricId, mean})
        return measurement.dataValues
    },
    createAggregatedMeasurement: async (_, data) => {
        const aggregatedMeasurement = await db.AggregatedMeasurement.create({metricId, mean})
        return metric.dataValues
    },
}

const resolvers = { Query, Mutation };

export { resolvers };