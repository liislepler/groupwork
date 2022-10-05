const express = require('express')
const jwt = require('jsonwebtoken')
const hasTypes = require('./has-types.js')
const db = require('./db.js')

const app = express()

app.get("/", function(request, response) {
    response.send("Hello, World")
})


app.listen(3000)