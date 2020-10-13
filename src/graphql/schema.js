module.exports = `

type Query {
  mongoGetCompanys: [Company!] 

  redisGetCompany(key: String!): String!

  mongoGetCompany(id: ID!): Company
}

type Mutation {
  redisSetCompany(key: String!, value:  String!): Boolean!

  mongoCreateCompany(name: String!): Company
}

type Company {
  id: ID!

  name: String!
}`;
