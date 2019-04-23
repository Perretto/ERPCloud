const port = 3002

const bodyParser = require('body-parser')
const express = require('express')
const server = express()
const allowCors = require('./cors')
const queryParser = require('express-query-int')

server.use(bodyParser.urlencoded({ 
    extended: false ,
    parameterLimit: 100000,
    limit: 1024 * 1024 * 1000
}))
server.use(bodyParser.json({
    extended: false,
    parameterLimit: 100000,
    limit: 1024 * 1024 * 1000,
    type: function(req) {
        return req.headers['Content-Type'] === '*/*; charset=UTF-8';
    }
})) 

server.use(allowCors)
server.use(queryParser())

server.listen(3002, function() {
    console.log(`BACKEND is running on port ${port}.`)
})

module.exports = server