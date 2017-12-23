'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  var Metric = sequelize.define('Metric', {
    id: {
      type: DataTypes.UUID(),
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID(),
      allowNull: true
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    propertyId: {
      type: DataTypes.UUID(),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      get: function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          var p, pName, e;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!this.dataValues.name) {
                    _context.next = 2;
                    break;
                  }

                  return _context.abrupt('return', this.dataValues.name);

                case 2:
                  _context.next = 4;
                  return this.getProperty();

                case 4:
                  p = _context.sent;
                  _context.next = 7;
                  return p.name;

                case 7:
                  pName = _context.sent;
                  _context.next = 10;
                  return p.getEntity();

                case 10:
                  e = _context.sent;
                  return _context.abrupt('return', e.name + '-' + pName);

                case 12:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function get() {
          return _ref.apply(this, arguments);
        }

        return get;
      }()
    },
    description: DataTypes.TEXT,
    resolvesAt: DataTypes.DATE,
    isArchived: DataTypes.BOOLEAN
  });
  Metric.associate = function (models) {
    Metric.Measurements = Metric.hasMany(models.Measurement, { foreignKey: 'metricId', as: 'measurements' });
    Metric.AggregatedMeasurements = Metric.hasMany(models.AggregatedMeasurement, { foreignKey: 'metricId', as: 'aggregatedMeasurements' });
    Metric.User = Metric.belongsTo(models.User, { foreignKey: 'userId' });
    Metric.Property = Metric.belongsTo(models.Property, { foreignKey: 'propertyId' });
    Metric.Entity = Metric.belongsTo(models.Entity, { as: 'entity' });
  };
  return Metric;
};