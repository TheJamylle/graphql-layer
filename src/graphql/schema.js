module.exports = `

type Query {
  redisGet(id: String!, key: String!, data: String!): String
}

type Mutation {
  redisSet(id: String!, key: String!, data: String!): Boolean!
}
`;
