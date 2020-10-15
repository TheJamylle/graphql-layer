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


const { API_WEBSERVICE, BOT_TOKEN, REDIS_AUTH } = process.env

const headers = { Authorization: `Bearer ${BOT_TOKEN}`, 'Content-Type': 'application/json', 'Accept': 'application/json',}

const redis = new Redis({ password: REDIS_AUTH })



const resolvers = {
      Query: {
        redisGet: async (_, {id, key, data}) => {
          try {
            return redis.hget(`${data}:`+id, key)
          } catch (error) {
            console.log(error)
            return false
          }
        }
      },
    
      Mutation: {
        redisSet: async (_, {id, key, data}) => {
          try {
            const value = await fetch(`${API_WEBSERVICE}${data}s/${key}/${id}`, 
              { method: 'GET', headers}
            ).then(res => res.json())
            await redis.hset(`${data}:${id}`, key, value )
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