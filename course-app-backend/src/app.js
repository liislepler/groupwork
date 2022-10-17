const express = require('express')
    //const db = require('./db.js')
const sqlite3 = require('sqlite3')
const jsonwebtoken = require('jsonwebtoken')


// Create the database connection
const db = new sqlite3.Database('./course-database.db')

// Create tables in the database.
db.run(`CREATE TABLE IF NOT EXISTS accounts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT,
	password TEXT
)`)

db.run(`CREATE TABLE IF NOT EXISTS notes (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT,
	notetext TEXT,
    course TEXT,
	accountId INTEGER REFERENCES accounts(id)
)`)

db.run(`CREATE TABLE IF NOT EXISTS courses (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT,
	description TEXT,
	accountId INTEGER REFERENCES accounts(id)
)`)
    // OPTIONAL TODO: Make use of foreign key constraints.

// Create the app object we can use to tell express
// how to handle incoming HTTP requests.
const app = express()

// Enable CORS.
app.use(function(request, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader("Access-Control-Allow-Methods", "*")
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

// GET /notes
app.get("/notes", function(request, response) {

    const query = "SELECT * FROM notes"

    db.all(query, function(error, notes) {

        if (error) {
            console.log(error)
            response.status(500).end()
        } else {
            response.status(200).json(notes)
        }

    })

})

// GET /notes/57
app.get("/notes/:id", function(request, response) {

    const id = request.params.id

    const query = "SELECT * FROM notes WHERE id = ?"
    const values = [id]

    db.get(query, values, function(error, note) {

        if (error) {
            response.status(500).end()
        } else if (note) {
            response.status(200).json(note)
        } else {
            response.status(404).end()
        }

    })

})

// POST /notes
// Content-Type: application/json
// Authorization: THE_ACCESS_TOKEN
// {"type": "bike", "weight": 4, "accountId": 7}
app.post('/notes', function(request, response) {

    const accessToken = request.get("Authorization")

    // TODO: "oiuiuytrtefxfx" is also used at another place;
    // better to put it in a constant, and refer to the constant
    // at both places.
    const payload = jsonwebtoken.verify(accessToken, "oiuiuytrtefxfx")

    const title = request.body.title
    const notetext = request.body.notetext
    const course = request.body.course
    const accountId = request.body.accountId

    // Send back 401 if the user tries to create an ad for
    // another account than the one he is logged in on.
    if (accountId != payload.accountId) {
        response.status(401).end()
        return
    }

    // Do validation.
    const errorCodes = []


    // If we have validation errors, send them back,
    // otherwise insert the ad into the database.
    if (0 < errorCodes.length) {
        response.status(400).json(errorCodes)
    } else {

        const query = "INSERT INTO notes (title, notetext, course, accountId) VALUES (?, ?, ?, ?)"
        const values = [title, notetext, course, accountId]

        db.run(query, values, function(error) {
            if (error) {
                response.status(500).end()
            } else {
                response.status(201).end()
            }
        })

    }

})


// GET all courses
app.get("/courses", function(request, response) {

    const query = "SELECT * FROM courses"

    db.all(query, function(error, courses) {

        if (error) {
            console.log(error)
            response.status(500).end()
        } else {
            response.status(200).json(courses)
        }

    })

})

// GET /courses/57
app.get("/courses/:id", function(request, response) {

    const id = request.params.id

    const query = "SELECT * FROM courses WHERE id = ?"
    const values = [id]

    db.get(query, values, function(error, course) {

        if (error) {
            response.status(500).end()
        } else if (course) {
            response.status(200).json(course)
        } else {
            response.status(404).end()
        }

    })

})

// POST /courses
// Content-Type: application/json
// Authorization: THE_ACCESS_TOKEN
// {"type": "bike", "weight": 4, "accountId": 7}
app.post('/courses', function(request, response) {

    const accessToken = request.get("Authorization")

    // TODO: "oiuiuytrtefxfx" is also used at another place;
    // better to put it in a constant, and refer to the constant
    // at both places.
    const payload = jsonwebtoken.verify(accessToken, "oiuiuytrtefxfx")

    const title = request.body.title
    const description = request.body.description
    const accountId = request.body.accountId

    // Send back 401 if the user tries to create an ad for
    // another account than the one he is logged in on.
    if (accountId != payload.accountId) {
        response.status(401).end()
        return
    }

    // Do validation.
    const errorCodes = []


    // If we have validation errors, send them back,
    // otherwise insert the ad into the database.
    if (0 < errorCodes.length) {
        response.status(400).json(errorCodes)
    } else {

        const query = "INSERT INTO courses (title, description, accountId) VALUES (?, ?, ?)"
        const values = [title, description, accountId]

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