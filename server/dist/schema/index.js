"use strict";

var _graphqlTools = require("graphql-tools");

var _resolvers = require("../resolvers");

// Define types
var typeDefs = "\n  type Question {\n    id: ID! \n  }\n\n  type Query {\n    Question(id: ID): Question\n    Questions: [Question]\n  }\n";

// Generate the schema object from your types definition.
module.exports = (0, _graphqlTools.makeExecutableSchema)({ typeDefs: typeDefs, resolvers: _resolvers.resolvers });