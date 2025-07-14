const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
    userId: ID!
  }

  type Query {
    getTodos: [Todo]
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): String
    login(email: String!, password: String!): String
    addTodo(title: String!): Todo
    toggleTodo(id: ID!): Todo
    deleteTodo(id: ID!): String
  }
`;
