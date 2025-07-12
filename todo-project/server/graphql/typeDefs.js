import { gql } from "apollo-server-express";

export default gql`
  type User {
    id: ID!
    username: String!
    token: String
  }

  type Todo {
    id: ID!
    task: String!
    completed: Boolean!
    userId: ID!
  }

  type Query {
    getTodos: [Todo]
  }

  type Mutation {
    register(username: String!, password: String!): User
    login(username: String!, password: String!): User
    addTodo(task: String!): Todo
    toggleTodo(id: ID!): Todo
    deleteTodo(id: ID!): Boolean
  }
`;
