const express = require('express')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const mongoose = require('mongoose')
const Redis = require('ioredis')
const bodyParser = require('body-parser')
const User = require('./models/User')

mongoose.connect('mongodb://127.0.0.1:27017/test', { userNewUrlParser: true })

const db = mongoose.connection

const redis = new Redis()

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {});

const resolvers = {
    Query: {
        get: (parent, {key}, {redis}) => {
          try {
            return redis.get(key)
          } catch (error) {
            return null
          }
        },
        getUsers: () => {
          User.find()
        },
        getUser: (_, { id }) => User.findById(id)
      },
    
      Mutation: {
        set: async (_, {key, value}, {redis}) => {
          try {
            await redis.set(key, value)
            return true
          } catch (error) {
            console.log(error)
            return false
          }
        },
        createUser: (_, { name, email }) => User.create({ name, email })
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
  typeDefs: require('./schema'),
})


app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema: executableSchema, context: { redis }
}))

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

app.listen(8888, () => console.log('Dessa vez tá rodando na 8888'))