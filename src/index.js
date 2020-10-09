const express = require('express')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const mongoose = require('mongoose')
const Redis = require('ioredis')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost:27017/test', {userNewUrlParser: true})

const db = mongoose.connection

const redis = new Redis()

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {});

const schema = require('./schema')

const resolvers = {
    Query: {
        get: (parent, {key}, {redis}) => {
          try {
            return redis.get(key)
          } catch (error) {
            return null
          }
        }
      },
    
      Mutation: {
        set: async (parent, {key, value}, {redis}) => {
          try {
            await redis.set(key, value)
            return true
          } catch (error) {
            console.log(error)
            return false
          }
        }
      }
}

const app = express()

const executableSchema = makeExecutableSchema({
  typeDefs: [schema],
  resolvers,
  context: request => {
    return {
      ...request
    }
  }
})

app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema: executableSchema, context: { redis }
}))

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

app.listen(8888, () => console.log('Dessa vez tá rodando na 8888'))