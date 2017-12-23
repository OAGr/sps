'use strict';

var withAbstractBackup = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(item, property) {
    var abstractProperty;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(!item.dataValues[property] && item.dataValues.abstractId)) {
              _context.next = 7;
              break;
            }

            _context.next = 3;
            return item.getAbstractProperty();

          case 3:
            abstractProperty = _context.sent;
            return _context.abrupt('return', abstractProperty.dataValues[property]);

          case 7:
            return _context.abrupt('return', item.dataValues[property]);

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function withAbstractBackup(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  var Property = sequelize.define('Property', {
    id: {
      type: DataTypes.UUID(),
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    abstractId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    name: {
      type: Sequelize.STRING,
      get: function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return withAbstractBackup(this, 'name');

                case 2:
                  return _context2.abrupt('return', _context2.sent);

                case 3:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function get() {
          return _ref2.apply(this, arguments);
        }

        return get;
      }()
    },
    isAbstract: {
      type: Sequelize.BOOLEAN
    },
    resolvesAt: {
      type: Sequelize.DataTypes.ARRAY(Sequelize.DATE),
      get: function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return withAbstractBackup(this, 'resolvesAt');

                case 2:
                  return _context3.abrupt('return', _context3.sent);

                case 3:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function get() {
          return _ref3.apply(this, arguments);
        }

        return get;
      }()
    },
    type: {
      type: Sequelize.ENUM(["EVENT", "PROJECTION", "PROBABILITY"]),
      get: function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return withAbstractBackup(this, 'type');

                case 2:
                  return _context4.abrupt('return', _context4.sent);

                case 3:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function get() {
          return _ref4.apply(this, arguments);
        }

        return get;
      }()
    }
  });
  Property.prototype.generateMetrics = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var _this = this;

    var resolvesAt;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return this.resolvesAt;

          case 2:
            resolvesAt = _context6.sent;
            _context6.next = 5;
            return Promise.all(resolvesAt.map(function () {
              var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(r) {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return _this.createMetric({ resolvesAt: r, entityId: _this.entityId });

                      case 2:
                      case 'end':
                        return _context5.stop();
                    }
                  }
                }, _callee5, _this);
              }));

              return function (_x3) {
                return _ref6.apply(this, arguments);
              };
            }()));

          case 5:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));
  Property.afterCreate(function (p) {
    if (!p.isAbstract) {
      p.generateMetrics();
    }
  });
  Property.associate = function (models) {
    Property.Entity = Property.belongsTo(models.Entity, { foreignKey: 'entityId', as: 'entity' });
    Property.Category = Property.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    Property.Metrics = Property.hasMany(models.Metric, { foreignKey: 'propertyId', as: 'metrics' });
    Property.AbstractProperty = Property.belongsTo(models.Property, { foreignKey: 'abstractId', as: 'abstractProperty' });
  };
  return Property;
};