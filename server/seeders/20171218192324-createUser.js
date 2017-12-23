'use strict';
var models = require('../lib/models');


const dates = ['2018-01-01 04:05:02', '2019-01-01 04:05:02', '2020-01-01 04:05:02', '2025-01-01 04:05:02', '2030-01-01 04:05:02'];
const companyCategory = {
  name: 'Coorporation',
  entities: [
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
  ],
  abstractProperties: ["Revenue", "Market Capitalization", "Number of Employees"]
}

const icos = {
  name: 'CryptoCurrencies',
  entities: [
    {
      name: "Bitcoin",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Apple_Inc.",
      image: "https://pbs.twimg.com/profile_images/421692600446619648/dWAbC2wg_400x400.jpeg",
    },
    {
      name: "Ethereum",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Tesla,_Inc.",
      image: "https://pbs.twimg.com/profile_images/626149701189042177/LWpxKEv3_400x400.png",
    },
    {
      name: "Zcash",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Microsoft",
      image: "https://pbs.twimg.com/profile_images/717425246836404225/vbhWLY6A_400x400.jpg",
    },
    {
      name: "Ripple",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Tesla,_Inc.",
      image: "https://pbs.twimg.com/profile_images/879392946730094592/IwNebNtK_400x400.jpg",
    },
    {
      name: "Monero",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Square,_Inc.",
      image: "https://pbs.twimg.com/profile_images/473825289630257152/PzHu2yli_400x400.png",
    },
    {
      name: "Dash",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Amazon_(company)",
      image: "https://pbs.twimg.com/profile_images/645523576750104576/DLqXx1_n_400x400.png",
    },
  ],
  abstractProperties: ["Market Capitalization", "Price", "Volume", "Circulating Supply"]
}

const safetyOrganizations = {
  name: 'AI Safety Organization',
  entities: [
    {
      name: "MIRI",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Apple_Inc.",
      image: "https://pbs.twimg.com/profile_images/914881949185052673/30Lb89kQ_400x400.jpg",
    },
    {
      name: "FHI",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Tesla,_Inc.",
      image: "https://pbs.twimg.com/profile_images/881863398518140928/ULx8shN2_400x400.jpg",
    },
    {
      name: "AI Impacts",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Tesla,_Inc.",
      image: "https://pbs.twimg.com/profile_images/601605260252024833/aeNPn9YV_bigger.png",
    },
    {
      name: "OpenAI Safety Team",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Square,_Inc.",
      image: "https://pbs.twimg.com/profile_images/844620470091624448/gngyjBD9_400x400.jpg",
    },
    {
      name: "FLI",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Amazon_(company)",
      image: "https://pbs.twimg.com/profile_images/473340564511813632/MAjcpOk0_400x400.jpeg",
    },
  ],
  abstractProperties: ["Papers Published", "Total Citations to Date", "Number of Employees", "Total Funding to Date"]
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

async function createCategory({ name, entities, abstractProperties }) {
  const category = await models.Category.create({ name })

  let _abstractProperties = []
  for (let property of abstractProperties) {
    const p = await models.Property.create({ name: property, categoryId: category.id, isAbstract: true, resolvesAt: dates });
    _abstractProperties = [..._abstractProperties, p]
  }

  let _entities = []
  for (let entity of entities) {
    const e = await models.Entity.create(entity)
    const ec = await models.EntityCategory.create({ entityId: e.id, categoryId: category.id })
    for (let property of _abstractProperties) {
      await models.Property.create({ entityId: e.id, abstractId: property.id, isAbstract: false })
    }
  }

}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await createCategory(companyCategory)
    await createCategory(icos)
    await createCategory(safetyOrganizations)

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
        await models.Measurement.create({ metricId: metric.id, userId: user.id, mean })
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
