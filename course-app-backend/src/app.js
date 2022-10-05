const express = require('express')
const sqlite3 = require('sqlite3')

const app = express()

app.get("/", function(request, response) {
    response.send("Hello, World")
})

app.listen(3000)

const db = new sqlite3.Database("my-database.db")

db.run("Your SQL query")