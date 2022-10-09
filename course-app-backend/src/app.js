const express = require('express')
const jwt = require('jsonwebtoken')
    //const db = require('./db.js')
const sqlite3 = require('sqlite3')

// Create the database connection
const db = new sqlite3.Database('./course-database.db')

// Create tables in the database.
db.run(`CREATE TABLE IF NOT EXISTS accounts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT,
	password TEXT
)`)

db.run(`CREATE TABLE IF NOT EXISTS ads (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	type TEXT,
	weight INTEGER,
	accountId INTEGER
)`)
    // OPTIONAL TODO: Make use of foreign key constraints.

// Create the app object we can use to tell express
// how to handle incoming HTTP requests.
const app = express()

// Enable CORS.
app.use(function(request, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader("Access-Control-Allow-Method", "*")
    response.setHeader("Access-Control-Allow-Headers", "*")
    response.setHeader("Access-Control-Expose-Headers", "*")
    next()
})

// Add functionality for reading out bodies in requests
// written in JSON format.
app.use(
    express.json()
)

// POST /tokens
// Content-Type: application/json
// {"username": "Alice", "password": "abc123"}
app.post('/tokens', function(request, response) {

    const username = request.body.username
    const password = request.body.password

    const query = "SELECT * FROM accounts WHERE username = ? AND password = ?"
    const values = [username, password]

    db.get(query, values, function(error, account) {
        if (error) {
            console.log(error)
            response.status(500).end()
        } else if (account) {
            // Successful login!

            const accessToken = jsonwebtoken.sign({
                accountId: account.id,
            }, "oiuiuytrtefxfx")

            const idToken = jsonwebtoken.sign({
                accountId: account.id,
                username: account.username,
            }, "lkjlkj")

            response.status(200).json({
                accessToken,
                idToken
            })

        } else {
            response.status(400).json(["wrongCredentials"])
        }
    })

})

// GET /accounts
app.get("/accounts", function(request, response) {

    const query = "SELECT * FROM accounts"

    db.all(query, function(error, accounts) {

        if (error) {
            console.log(error)
            response.status(500).end()
        } else {
            response.status(200).json(accounts)
        }

    })

})

// POST /accounts
// Content-Type: application/json
// {"username": "Alice", "password": "abc123"}
app.post('/accounts', function(request, response) {

    const username = request.body.username
    const password = request.body.password

    const errorCodes = []

    if (username == "") {
        errorCodes.push("usernameIsEmpty")
    }

    if (password == "") {
        errorCodes.push("passWordIsEmpty")
    }

    if (0 < errorCodes.length) {
        response.status(400).json(errorCodes)
    } else {

        const query = "INSERT INTO accounts (username, password) VALUES (?, ?)"
        const values = [username, password]

        db.run(query, values, function(error) {
            if (error) {
                response.status(500).end()
            } else {
                response.status(201).end()
            }
        })

    }

})

// GET /ads
app.get("/ads", function(request, response) {

    const query = "SELECT * FROM ads"

    db.all(query, function(error, ads) {

        if (error) {
            console.log(error)
            response.status(500).end()
        } else {
            response.status(200).json(ads)
        }

    })

})

// GET /ads/57
app.get("/ads/:id", function(request, response) {

    const id = request.params.id

    const query = "SELECT * FROM ads WHERE id = ?"
    const values = [id]

    db.get(query, values, function(error, ad) {

        if (error) {
            response.status(500).end()
        } else if (ad) {
            response.status(200).json(ad)
        } else {
            response.status(404).end()
        }

    })

})

// POST /ads
// Content-Type: application/json
// Authorization: THE_ACCESS_TOKEN
// {"type": "bike", "weight": 4, "accountId": 7}
app.post('/ads', function(request, response) {

    const accessToken = request.get("Authorization")

    // TODO: "oiuiuytrtefxfx" is also used at another place;
    // better to put it in a constant, and refer to the constant
    // at both places.
    const payload = jsonwebtoken.verify(accessToken, "oiuiuytrtefxfx")

    const type = request.body.type
    const weight = request.body.weight
    const accountId = request.body.accountId

    // Send back 401 if the user tries to create an ad for
    // another account than the one he is logged in on.
    if (accountId != payload.accountId) {
        response.status(401).end()
        return
    }

    // Do validation.
    const errorCodes = []

    if (type != "shark" && type != "abborre") {
        errorCodes.push("invalidType")
    }

    if (weight < 0) {
        errorCodes.push("invalidWeight")
    }

    // If we have validation errors, send them back,
    // otherwise insert the ad into the database.
    if (0 < errorCodes.length) {
        response.status(400).json(errorCodes)
    } else {

        const query = "INSERT INTO ads (type, weight, accountId) VALUES (?, ?, ?)"
        const values = [type, weight, accountId]

        db.run(query, values, function(error) {
            if (error) {
                response.status(500).end()
            } else {
                response.status(201).end()
            }
        })

    }

})

// Tell express to start listening for incoming
// HTTP requests on port 3000.
// (http://localhost:3000)
app.listen(3000)