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
    const dates = ['2018-01-01 04:05:02', '2019-01-01 04:05:02', '2020-01-01 04:05:02', '2025-01-01 04:05:02', '2030-01-01 04:05:02'];
    const companies = [
      {
        name: "Apple, Inc",
        wikipediaUrl: "https://en.wikipedia.org/wiki/Apple_Inc.",
        image: "https://pbs.twimg.com/profile_images/856508346190381057/DaVvCgBo_400x400.jpg",
      },
      {
        name: "Tesla, Inc",
        wikipediaUrl: "https://en.wikipedia.org/wiki/Tesla,_Inc.",
        image: "https://pbs.twimg.com/profile_images/489192650474414080/4RxZxsud_400x400.png",
      },
      {
        name: "Microsoft, Inc",
        wikipediaUrl: "https://en.wikipedia.org/wiki/Microsoft",
        image: "https://pbs.twimg.com/profile_images/875416480547917824/R6wl9gWl_400x400.jpg",
      },
      {
        name: "Facebook, Inc",
        wikipediaUrl: "https://en.wikipedia.org/wiki/Tesla,_Inc.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/170px-Tesla_Motors.svg.png",
      },
      {
        name: "Square, Inc",
        wikipediaUrl: "https://en.wikipedia.org/wiki/Square,_Inc.",
        image: "https://pbs.twimg.com/profile_images/923950005928452096/iBu5RASh_400x400.jpg",
      },
      {
        name: "Amazon (company)",
        wikipediaUrl: "https://en.wikipedia.org/wiki/Amazon_(company)",
        image: "https://pbs.twimg.com/profile_images/936662928513581061/tGI9u58H_400x400.jpg",
      },
    ]
    const companyCategory = await models.Category.create({name: "company"})
    const _abstractProperties = ["Revenue", "Market Capitalization", "Number of Employees"]

    let abstractProperties = []
    for (let property of _abstractProperties) {
      const p = await models.Property.create({name: property, categoryId: companyCategory.id, isAbstract: true, resolvesAt: dates});
      abstractProperties = [...abstractProperties, p]
    }

    let company = []
    for (let company of companies) {
      const e = await models.Entity.create(company)
      const ec = await models.EntityCategory.create({entityId: e.id, categoryId: companyCategory.id})

      for (let property of abstractProperties) {
        await models.Property.create({entityId: e.id, abstractId: property.id, isAbstract: false})
      }
    }

    const users = [
      {
        name: "George Smith",
      },
      {
        name: "Bernie Sanders Smith",
      },
      {
        name: "Miles Davis",
      },
    ]

    let allUsers = []
    for (let user of users) {
      const u = await models.User.create(user)
      allUsers = [...allUsers, u]
    }

    const allMetrics = await models.Metric.findAll({})
    for (let metric of allMetrics) {
      const meanMean = Math.random() * 500
      for (let user of allUsers) {
        const bias = Math.random() * 200 - 100
        const mean = meanMean + bias
        await models.Measurement.create({metricId: metric.id, userId: user.id, mean })
      }
    }
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
