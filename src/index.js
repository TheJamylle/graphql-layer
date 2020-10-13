const express = require('express')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const Redis = require('ioredis')
const bodyParser = require('body-parser')
const Company = require('./models/Company')
const connectMongoDB = require('../config/db')
const Request = require('request')

connectMongoDB()

const redis = new Redis({ password: 'XlUPvVeJq4llAQ6l75W5OiFv/4JELfitGH25b8Dc21OEI0sgS8t6+YvKgkKSlpRA44KEkSPVowk3tRbg' })

Request.get('http://localhost:8080/companys/name/1', (error, response, body) => {
  if(error) {
    return console.dir(error);
  }
  return JSON.parse(body)
})

const resolvers = {
    Query: {
        redisGetCompany: (parent, {key}, {redis}) => {
          try {
            return redis.get(key)
          } catch (error) {
            return null
          }
        },
        mongoGetCompanys: () => {
          Company.find()
        },
        mongoGetCompany: (_, { id }) => Company.findById(id)
      },
    
      Mutation: {
        redisSetCompany: async (_, {key, value}, {redis}) => {
          try {
            await redis.set(key, value)
            return true
          } catch (error) {
            console.log(error)
            return false
          }
        },
        mongoCreateCompany: async (_, { name }) => {
          await new Company({ name }).save()
        
        }
      }
}

const app = express()

const executableSchema = makeExecutableSchema({
  context: request => {
    return {
      ...request
    }
  },
  resolvers,
  typeDefs: require('./graphql/schema'),
})


app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema: executableSchema, context: { redis }
}))

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

app.listen(8888, () => console.log('Dessa vez tá rodando na 8888'))