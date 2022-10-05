const express = require('express')
const sqlite3 = require('sqlite3')
const jwt = require('jsonwebtoken')
const db = require('./db.js')

const app = express()

app.get("/", function(request, response) {
    response.send("Hello, World")
})

app.listen(8000)