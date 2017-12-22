'use strict';
var models = require('../lib/models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
    // const user2 = await models.User.create({ name: "Sample User 2"})
    // const user3 = await models.User.create({ name: "Sample User 3"})
    // const user4 = await models.User.create({ name: "Sample User 4"})

    // const metric1 = await models.Metric.create({name: "When will AGI happen?", description: "I'm really curious", userId: user1.id, resolvesAt: '2030-08-09 04:05:02'})
    // const metric2 = await models.Metric.create({name: "When will human uploading happen?", description: "sample description", userId: user2.id, resolvesAt: '2030-08-09 04:05:02'})

    // const measurement1 = await models.Measurement.create({metricId: metric1.id, userId: user1.id, mean: 5})
    // const measurement2 = await models.Measurement.create({metricId: metric1.id, userId: user2.id, mean: 50})
    // const measurement3 = await models.Measurement.create({metricId: metric1.id, userId: user3.id, mean: 10})

    // const measurement4 = await models.Measurement.create({metricId: metric2.id, userId: user1.id, mean: 100})
    // const measurement5 = await models.Measurement.create({metricId: metric2.id, userId: user2.id, mean: 200})
    // const measurement6 = await models.Measurement.create({metricId: metric2.id, userId: user3.id, mean: 300})

    const user1 = await models.User.create({ name: "Sample User 1"})
    const c1 = await models.Category.create({name: "company"})
    console.log("2")
    const ap1 = await models.Property.create({name:"revenue", categoryId: c1.id, isAbstract: true, resolvesAt: ['2030-08-09 04:05:02', '2035-08-09 04:05:02', '2040-08-09 04:05:02']})
    const ap2 = await models.Property.create({name:"head count", categoryId: c1.id, isAbstract: true, resolvesAt: ['2030-08-09 04:05:02', '2035-08-09 04:05:02', '2040-08-09 04:05:02']})
    const ap3 = await models.Property.create({name:"profit", categoryId: c1.id, isAbstract: true, resolvesAt: ['2030-08-09 04:05:02', '2035-08-09 04:05:02', '2040-08-09 04:05:02']})
    console.log("3")
    const e1 = await models.Entity.create({name:"Tesla"})
    const e2 = await models.Entity.create({name:"Apple"})
    const e3 = await models.Entity.create({name:"Microsoft"})

    const p1 = models.Property.create({entityId: e1.id, abstractId: ap1.id})
    const p2 = models.Property.create({entityId: e1.id, abstractId: ap2.id})
    const p3 = models.Property.create({entityId: e1.id, abstractId: ap3.id})

    const e11 = await models.EntityCategory.create({entityId: e1.id, categoryId: c1.id})
    const e12 = await models.EntityCategory.create({entityId: e2.id, categoryId: c1.id})
    const e13 = await models.EntityCategory.create({entityId: e3.id, categoryId: c1.id})

    // const measurement1 = await models.Measurement.create({metricId: metric1.id, userId: user1.id, mean: 5})
    // const measurement2 = await models.Measurement.create({metricId: metric1.id, userId: user2.id, mean: 50})
    // const measurement3 = await models.Measurement.create({metricId: metric1.id, userId: user3.id, mean: 10})


    // const m1 = await models.Metric.create({name: "When will AGI happen?", description: "I'm really curious", userId: user1.id, resolvesAt: '2030-08-09 04:05:02'})


    // const e2 = await models.Entity.create({name:"Apple"})
    // const foo = await e1.getCategories();
    // e1.addCategory(c2);
    // e1.addCategory(c3);
    // console.log("Added category",  e1, c1)
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
