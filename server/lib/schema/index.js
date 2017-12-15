import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from "../resolvers";

// Define types
const typeDefs = `
  type Question {
    id: ID! 
  }

  type Query {
    Question(id: ID): Question
    Questions: [Question]
  }
`;

// Generate the schema object from your types definition.
module.exports = makeExecutableSchema({ typeDefs, resolvers });