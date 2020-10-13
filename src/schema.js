module.exports = `

type Query {
  getUsers: [User!] 

  get(key: String!): String!

  getUser(id: ID!): User
}

type Mutation {
  set(key: String!, value:  String!): Boolean!

  createUser(name: String!, email: String!): User
}

type User {
  id: ID!

  name: String!

  email: String!
}`;
