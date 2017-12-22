'use strict';
var models = require('../lib/models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
    const user1 = await models.User.create({ name: "Sample User 1"})
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
    const c1 = await models.Category.create({name: "company"})
    const ap1 = await models.AbstractProperty.create({name:"revenue", categoryId: c1.id})
    const ap1 = await models.AbstractProperty.create({name:"employee count", categoryId: c1.id})
    const ap1 = await models.AbstractProperty.create({name:"", categoryId: c1.id})
    // const c2 = await models.Category.create({name: "employee count"})
    // const c3 = await models.Category.create({name: "something else..."})
    const e1 = await models.Entity.create({name:"Tesla"})

    e1.addCategory(c1);
    const p1 = await models.Property.create({entityId: e1.id, abstractPropertyId: ap1.id, value: 'true'})
    // const e2 = await models.Entity.create({name:"Apple"})
    // const foo = await e1.getCategories();
    // e1.addCategory(c2);
    // e1.addCategory(c3);
    console.log("Added category",  e1, c1)
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
