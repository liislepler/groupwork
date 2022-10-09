import jwtDecode from 'jwt-decode'
const idToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInByZWZlcnJlZF91c2VybmFtZSI6IkFsaWNlIn0.3Xp7iQkttgTE6hpuT28LFdZ7EYWHlPndqdaWoIzTr9A"
const dataInIdToken = jwtDecode(idToken)

const request = new XMLHttpRequest()

// Specify method and URI.
request.open("POST", "https://localhost:3000/accounts")

// Add headers to the request.
request.setRequestHeader("Content-Type", "application/json")
    // ...

// Add a callback function that will be called when
// we receive back the response.
request.addEventListener('load', function() {
    const statusCode = request.status
    const bodyAsString = request.responseText
    const bodyAsJsObject = JSON.parse(bodyAsString)
    const locationHeader = request.getResponseHeader("Location")
        // ...
})

// Add a callback function that will be called if
// the communication with the server fails.
request.addEventListener("error", function() {
    // Request failed :(
})

// Specify body and send it.
const accountToBeCreated = {
    username: "Alice",
    password: "abc123"
}
const bodyAsString = JSON.stringify(accountToBeCreated)
request.send(bodyAsString)

async function createAccount(accountToBeCreated) {

    const bodyAsString = JSON.stringify(accountToBeCreated)

    const response = await fetch("https://localhost:3000/accounts", {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: bodyAsString
    })

    const statusCode = response.status
    const locationHeader = response.headers.get("Location")
    const bodyAsJsObject = await response.json()

    return bodyAsObject

}

try {
    const bodyAsObject = await createAccount({
            username: "Alice",
            password: "abc123"
        })
        // ...
} catch (error) {
    // Called when something goes wrong :(
}