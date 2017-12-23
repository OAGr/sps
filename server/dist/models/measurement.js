'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  var Measurement = sequelize.define('Measurement', {
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
    mean: {
      type: DataTypes.FLOAT
    }
  }, {
    hooks: {
      afterCreate: function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(measurement, options) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return sequelize.models.AggregatedMeasurement.create({ metricId: measurement.metricId, measurementId: measurement.id, mean: 30 });

                case 2:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, undefined);
        }));

        return function afterCreate(_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }()
    }
  });
  Measurement.associate = function (models) {
    Measurement.Metric = Measurement.belongsTo(models.Metric, { foreignKey: 'metricId' });
    Measurement.User = Measurement.belongsTo(models.User, { foreignKey: 'userId' });
    Measurement.AggregatedMeasurement = Measurement.hasOne(models.AggregatedMeasurement, { foreignKey: 'measurementId', as: 'aggregatedMeasurement' });
  };
  return Measurement;
};