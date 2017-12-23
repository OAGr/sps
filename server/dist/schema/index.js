'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = undefined;

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _graphqlSequelize = require('graphql-sequelize');

var _graphql = require('graphql');

var _scalars = require('graphql/type/scalars');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var models = require('../models');


var generateReferences = function generateReferences(model, references) {
  var all = {};
  references.map(function (r) {
    all[r[0]] = {
      type: r[1](),
      resolve: (0, _graphqlSequelize.resolver)(model[r[2]])
    };
  });
  return all;
};

var makeObjectType = function makeObjectType(model, references) {
  return new _graphql.GraphQLObjectType({
    name: model.name,
    description: model.name,
    fields: function fields() {
      return _.assign((0, _graphqlSequelize.attributeFields)(model), generateReferences(model, references));
    }
  });
};

var userType = makeObjectType(models.User, [['metrics', function () {
  return metricType;
}, 'Metrics']]);

var aggregatedMeasurementType = makeObjectType(models.AggregatedMeasurement, []);

var measurementType = makeObjectType(models.Measurement, [['user', function () {
  return userType;
}, 'User'], ['aggregatedMeasurement', function () {
  return aggregatedMeasurementType;
}, 'AggregatedMeasurement']]);

var metricType = makeObjectType(models.Metric, [['user', function () {
  return userType;
}, 'User'], ['entity', function () {
  return entityType;
}, 'Entity'], ['property', function () {
  return propertyType;
}, 'Property'], ['measurements', function () {
  return new _graphql.GraphQLList(measurementType);
}, 'Measurements'], ['aggregatedMeasurements', function () {
  return new _graphql.GraphQLList(aggregatedMeasurementType);
}, 'AggregatedMeasurements']]);

var entityType = makeObjectType(models.Entity, [['categories', function () {
  return new _graphql.GraphQLList(categoryType);
}, 'Categories'], ['properties', function () {
  return new _graphql.GraphQLList(propertyType);
}, 'Properties'], ['metrics', function () {
  return new _graphql.GraphQLList(metricType);
}, 'Metrics']]);

var categoryType = makeObjectType(models.Category, [['entities', function () {
  return new _graphql.GraphQLList(entityType);
}, 'Entities'], ['properties', function () {
  return new _graphql.GraphQLList(propertyType);
}, 'Properties']]);

var propertyType = makeObjectType(models.Property, [['entity', function () {
  return entityType;
}, 'Entity'], ['category', function () {
  return categoryType;
}, 'Category'], ['metrics', function () {
  return new _graphql.GraphQLList(metricType);
}, 'Metrics'], ['abstractProperty', function () {
  return propertyType;
}, 'AbstractProperty']]);

var defaultUserId = "edfa7c14-2b34-45c0-bad2-1c0b994dac11";
// var i = 0;
// setInterval(() => {
//   var bar = models;
//   console.log(bar)
// 	console.log('hello world:' + i++);
//   debugger;
// }, 1000);

var schema = new _graphql.GraphQLSchema({
  query: new _graphql.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      metric: {
        type: metricType,
        args: _.pick((0, _graphqlSequelize.attributeFields)(models.Metric), ['id']),
        resolve: (0, _graphqlSequelize.resolver)(models.Metric)
      },
      metrics: {
        type: new _graphql.GraphQLList(metricType),
        resolve: (0, _graphqlSequelize.resolver)(models.Metric)
      },
      categories: {
        type: new _graphql.GraphQLList(categoryType),
        resolve: (0, _graphqlSequelize.resolver)(models.Category)
      },
      entities: {
        type: new _graphql.GraphQLList(entityType),
        resolve: (0, _graphqlSequelize.resolver)(models.Entity)
      },
      entity: {
        type: entityType,
        args: _.pick((0, _graphqlSequelize.attributeFields)(models.Entity), ['id']),
        resolve: (0, _graphqlSequelize.resolver)(models.Entity)
      },
      properties: {
        type: new _graphql.GraphQLList(propertyType),
        resolve: (0, _graphqlSequelize.resolver)(models.Property)
      }
    }
  }),
  mutation: new _graphql.GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      createMetric: {
        type: metricType,
        args: _.pick((0, _graphqlSequelize.attributeFields)(models.Metric), ['name', 'description', 'resolvesAt']),
        resolve: function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(__, _ref2) {
            var name = _ref2.name,
                description = _ref2.description,
                resolvesAt = _ref2.resolvesAt;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    return _context.abrupt('return', models.Metric.create({ name: name, description: description, resolvesAt: resolvesAt, isArchived: false }));

                  case 1:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, undefined);
          }));

          return function resolve(_x, _x2) {
            return _ref.apply(this, arguments);
          };
        }()
      },
      createMeasurement: {
        type: measurementType,
        args: _.pick((0, _graphqlSequelize.attributeFields)(models.Measurement), ['mean', 'metricId']),
        resolve: function () {
          var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(__, _ref4) {
            var mean = _ref4.mean,
                metricId = _ref4.metricId;
            var newMetric;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return models.Measurement.create({ mean: mean, metricId: metricId, userId: defaultUserId });

                  case 2:
                    newMetric = _context2.sent;
                    return _context2.abrupt('return', newMetric);

                  case 4:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, undefined);
          }));

          return function resolve(_x3, _x4) {
            return _ref3.apply(this, arguments);
          };
        }()
      }
    }
  })
});

exports.schema = schema;