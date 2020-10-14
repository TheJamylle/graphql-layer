module.exports = `

type Query {
  mongoGetCompanys: [Company!] 

  redisGet(id: String!, key: String!): String

  mongoGetCompany(id: ID!): Company
}

type Mutation {
  redisSet(id: String!, key: String!): Boolean!

  mongoCreateCompany(name: String!): Company
}
`;
