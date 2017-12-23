'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _ = require('lodash');
var Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  var AggregatedMeasurement = sequelize.define('AggregatedMeasurement', {
    id: {
      type: DataTypes.UUID(),
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    },
    metricId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    measurementId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    mean: DataTypes.FLOAT
  }, {
    hooks: {
      beforeCreate: function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(aggregatedMeasurement, options) {
          var metric, measurements;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return aggregatedMeasurement.getMetric();

                case 2:
                  metric = _context.sent;
                  _context.next = 5;
                  return metric.getMeasurements();

                case 5:
                  measurements = _context.sent;

                  aggregatedMeasurement.mean = _.meanBy(measurements, function (e) {
                    return e.dataValues.mean;
                  });

                case 7:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, undefined);
        }));

        return function beforeCreate(_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }()
    }
  });
  AggregatedMeasurement.associate = function (models) {
    AggregatedMeasurement.Metric = AggregatedMeasurement.belongsTo(models.Metric, { foreignKey: 'metricId' });
    AggregatedMeasurement.Measurement = AggregatedMeasurement.belongsTo(models.Measurement, { foreignKey: 'measurementId' });
  };
  return AggregatedMeasurement;
};