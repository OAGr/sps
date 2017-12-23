"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.resolvers = undefined;

var createMetric = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(name) {
        var metric;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return _index2.default.Metric.create({ name: name });

                    case 2:
                        metric = _context.sent;
                        return _context.abrupt("return", metric.dataValues);

                    case 4:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function createMetric(_x) {
        return _ref.apply(this, arguments);
    };
}();

var _lodash = require("lodash");

var _ = _interopRequireWildcard(_lodash);

var _graphqlSequelize = require("graphql-sequelize");

var _index = require("../models/index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Query = _defineProperty({
    metric: (0, _graphqlSequelize.resolver)(_index2.default.Metric),
    metrics: (0, _graphqlSequelize.resolver)(_index2.default.Metric, {
        list: true
    }),
    measurement: (0, _graphqlSequelize.resolver)(_index2.default.Measurement),
    measurements: (0, _graphqlSequelize.resolver)(_index2.default.Measurement, {
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
    aggregatedMeasurement: (0, _graphqlSequelize.resolver)(_index2.default.AggregatedMeasurement)
}, "aggregatedMeasurement", (0, _graphqlSequelize.resolver)(_index2.default.AggregatedMeasurement, {
    list: true
}));

var Mutation = {
    createMetric: function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_, data) {
            var metric;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return _index2.default.Metric.create({ name: data.name });

                        case 2:
                            metric = _context2.sent;
                            return _context2.abrupt("return", metric.dataValues);

                        case 4:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined);
        }));

        return function createMetric(_x2, _x3) {
            return _ref2.apply(this, arguments);
        };
    }(),
    createMeasurement: function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_, data) {
            var metricId, mean, measurement;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            metricId = data.metricId, mean = data.mean;
                            _context3.next = 3;
                            return _index2.default.Measurement.create({ metricId: metricId, mean: mean });

                        case 3:
                            measurement = _context3.sent;
                            return _context3.abrupt("return", measurement.dataValues);

                        case 5:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, undefined);
        }));

        return function createMeasurement(_x4, _x5) {
            return _ref3.apply(this, arguments);
        };
    }(),
    createAggregatedMeasurement: function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_, data) {
            var aggregatedMeasurement;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return _index2.default.AggregatedMeasurement.create({ metricId: metricId, mean: mean });

                        case 2:
                            aggregatedMeasurement = _context4.sent;
                            return _context4.abrupt("return", metric.dataValues);

                        case 4:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, undefined);
        }));

        return function createAggregatedMeasurement(_x6, _x7) {
            return _ref4.apply(this, arguments);
        };
    }()
};

var resolvers = { Query: Query, Mutation: Mutation };

exports.resolvers = resolvers;