const express = require('express')
const jwt = require('jsonwebtoken')
const hasTypes = require('./has-types.js')
const db = require('./db.js')

const app = express()

// Constants used for validation of resources.
const USERNAME_MIN_LENGTH = 3
const USERNAME_MAX_LENGTH = 9
const MIN_PASSWORD_LENGTH = 6 // Should be higher, is low to facilitate testing.

const TITLE_MIN_LENGTH = 5
const TITLE_MAX_LENGTH = 50
const DESCRIPTION_MIN_LENGTH = 20
const DESCRIPTION_MAX_LENGTH = 500

const ACCESS_TOKEN_SECRET = "sdfsdsd4flkjdsflkdsj"
const ID_TOKEN_SECRET = "fdkjjlpadfglfd6kyeu"

// Enable CORS.
app.use(function(request, response, next) {

    // Allow client-side JS from the following websites to send requests to us:
    // (not optimal, for better security, change * to the URI of your frontend)
    response.setHeader("Access-Control-Allow-Origin", "*")

    // Allow client-side JS to send requests with the following methods:
    response.setHeader("Access-Control-Allow-Methods", "*")

    // Allow client-side JS to send requests with the following headers:
    // (needed for the Authorization and Content-Type headers)
    response.setHeader("Access-Control-Allow-Headers", "*")

    // Allow client-side JS to read the following headers in the response:
    // (in addition to Cache-Control, Content-Language, Content-Type
    // Expires, Last-Modified, Pragma).
    // (needed for the Location header)
    response.setHeader("Access-Control-Expose-Headers", "*")

    next()

})

// Try to extract info from potential access token in the request.
app.use(function(request, response, next) {

    try {

        const authorizationHeader = request.get("Authorization")
        const accessToken = authorizationHeader.substring(
            "Bearer ".length,
        )

        jwt.verify(accessToken, ACCESS_TOKEN_SECRET, function(error, payload) {
            if (error) {
                console.log(`Retrieved invalid access token "${accessToken}".`)
            } else {
                request.accountId = payload.accountId
            }
            next()
        })

    } catch (error) {
        next()
    }

})

// Add middleware to parse the boyd in incoming HTTP requests.
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

// Requests for account resources.
app.get("/accounts", function(request, response) {
    db.getAllAccounts(function(errors, accounts) {
        if (errors.length == 0) {
            accounts.forEach(account => delete account.password)
            response.status(200).json(accounts)
        } else {
            response.status(500).end()
        }
    })
})

app.get("/accounts/:id", function(request, response) {

    const id = request.params.id

    db.getAccountById(id, function(errors, account) {
        if (errors.length == 0) {
            if (account) {
                delete account.password
                response.status(200).json(account)
            } else {
                response.status(404).end()
            }
        } else {
            response.status(500).end()
        }
    })

})

app.post("/accounts", function(request, response) {

    const account = request.body

    // Check that the account contains all expected properties.
    const accountTypes = {
        username: String,
        password: String
    }

    if (!hasTypes(account, accountTypes)) {
        response.status(422).end()
        return
    }

    // Validate the account.
    const validationErrors = []

    if (account.username.length < USERNAME_MIN_LENGTH) {
        validationErrors.push("usernameTooShort")
    } else if (USERNAME_MAX_LENGTH < account.username.length) {
        validationErrors.push("usernameTooLong")
    }

    if (account.password.length < MIN_PASSWORD_LENGTH) {
        validationErrors.push("passwordTooShort")
    }

    if (0 < validationErrors.length) {
        response.status(400).json(validationErrors)
        return
    }

    // Try to create the account.
    db.createAccount(account, function(errors, id) {
        if (errors.length == 0) {
            response.setHeader("Location", "/accounts/" + id)
            response.status(201).end()
        } else if (errors.includes("usernameTaken")) {
            response.status(400).json(errors)
        } else {
            response.status(500).end()
        }
    })

})


// Requests for token resources.
app.post("/tokens", function(request, response) {

    const grantInfo = request.body

    // Check that grantInfo contains all expected properties.
    const grantInfoTypes = {
        grant_type: String,
        username: String,
        password: String
    }

    if (!hasTypes(grantInfo, grantInfoTypes)) {
        response.status(400).json({ error: "invalid_request" })
        return
    }

    // Check that the grant type is supported.
    if (grantInfo.grant_type != "password") {
        response.status(400).json({ error: "unsupported_grant_type" })
        return
    }

    db.getAccountByUsername(grantInfo.username, function(errors, account) {
        if (errors.includes("databaseError")) {
            response.status(500).end()
        } else if (!account) {
            response.status(400).json({ error: "invalid_grant" })
        } else if (account.password != grantInfo.password) {
            response.status(400).json({ error: "invalid_grant" })
        } else {

            // Generate and send back access token + id token.
            const accessToken = jwt.sign({
                accountId: account.id
            }, ACCESS_TOKEN_SECRET)

            const idToken = jwt.sign({
                sub: account.id,
                preferred_username: account.username
            }, ID_TOKEN_SECRET)

            response.status(200).json({
                token_type: "Bearer",
                access_token: accessToken,
                id_token: idToken
            })

        }
    })

})


app.listen(3000)