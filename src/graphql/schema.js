module.exports = `

type Query {
  mongoGetCompanys: [Company!] 

  redisGetCompany(id: String!, key: String!): String

  mongoGetCompany(id: ID!): Company
}

type Mutation {
  redisSetCompany(id: String!, key: String!): Boolean!

  mongoCreateCompany(name: String!): Company
}

type Company {
  id: ID!

  name: String!
}`;
