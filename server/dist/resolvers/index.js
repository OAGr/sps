"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.resolvers = undefined;

var _lodash = require("lodash");

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Query = {
    Question: function Question(_, data) {
        return { id: 334 };
    },
    Questions: function Questions(_, data) {
        return [{ id: 334 }, { id: 33 }];
    }
};

var resolvers = { Query: Query };

exports.resolvers = resolvers;