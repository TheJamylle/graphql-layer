const express = require('express')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const Redis = require('ioredis')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const { config } = require('dotenv');

config({
  path: '.env',
});

connectMongoDB()

const { API_WEBSERVICE, BOT_TOKEN, REDIS_AUTH } = process.env

const redis = new Redis({ password: REDIS_AUTH })

const resolvers = {
      Query: {
        redisGet: async (_, {id, key, data}, {redis}) => {
          try {
            await fetch(`${API_WEBSERVICE}${data}s/${key}/${id}`, 
              { method: 'GET', headers: { Authorization: `Bearer ${BOT_TOKEN}` }}
            ).then(res => res.json())
            return redis.hget('company:'+id, key)
          } catch (error) {
            console.log(error)
          }
        }
      },
    
      Mutation: {
        redisSet: async (_, {id, key, data}, {redis}) => {
          try {
            //await redis.set(id, key)
            await redis.hset(`${data}:${id}`, 'name', key)
            return true
          } catch (error) {
            console.log(error)
            return false
          }
        },
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