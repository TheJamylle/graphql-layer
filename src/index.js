const express = require('express')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const Redis = require('ioredis')
const bodyParser = require('body-parser')
const Company = require('./models/Company')
const connectMongoDB = require('../config/db')
const Request = require('request')
const fetch = require('node-fetch')
const { config } = require('dotenv');

config({
  path: '.env',
});

connectMongoDB()

const { API_WEBSERVICE, BOT_TOKEN } = process.env

const redis = new Redis({ password: 'XlUPvVeJq4llAQ6l75W5OiFv/4JELfitGH25b8Dc21OEI0sgS8t6+YvKgkKSlpRA44KEkSPVowk3tRbg' })

const resolvers = {
      Query: {
        redisGetCompany: async (_, {id, key}, {redis}) => {
          console.log(await fetch(`${API_WEBSERVICE}companys/name/${id}`, {method: 'GET', headers: { Authorization: `Bearer ${BOT_TOKEN}` }}).then(res => res.json()))
          try {
            
            return redis.hget('company:'+id, key)
          } catch (error) {
            console.log(await Company.findById(id))
            return await Company.findById(id)
          }
        }
      },
    
      Mutation: {
        redisSetCompany: async (_, {id, key}, {redis}) => {
          try {
            //await redis.set(id, key)
            await redis.hset(`company:${id}`, 'name', key)
            await new Company({id, name: key}).save()
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