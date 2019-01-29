const port = 3002

const bodyParser = require('body-parser')
const express = require('express')
const server = express()
const allowCors = require('./cors')
const queryParser = require('express-query-int')

server.use(bodyParser.urlencoded({ 
    extended: true ,
    parameterLimit: 10000,
    limit: 1024 * 1024 * 10
}))
server.use(bodyParser.json({
    extended: false,
    parameterLimit: 10000,
    limit: 1024 * 1024 * 10
}))
server.use(allowCors)
server.use(queryParser())

server.listen(3002, function() {
    console.log(`BACKEND is running on port ${port}.`)
})

module.exports = server