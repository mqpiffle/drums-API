
// *********** *********** *********** //
// Import Dependencies                 //
// *********** *********** *********** //

const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

// *********** *********** *********** //
// Create Router                       //
// *********** *********** *********** //

const router = express.Router()

// *********** *********** *********** //
// Routes                              //
// *********** *********** *********** //

// the user needs to be able to:
// create an account

// POST -> users/signup
// this route creates new users in our db

// we use async because bcrypt needs to do its thing first once the info is submitted

router.post('/signup', async (req, res) => {
    // get a req.body and use that data to create a new user
    const newUser = req.body
    // encrypt their password with bcrypt
    newUser.password = await bcrypt.hash(
        newUser.password,
        await bcrypt.genSalt(10)
    )
    User.create(newUser)
        .then(user => {
            // iff success, respond with appropriate code and the username
            // DO NOT include password for security purposes 
            res.status(201).json({ username: user.username })
        })
        .catch(err => {
            //if error, handle error
            console.log(err)
            req.json(err)
        })
})

// log in to their account

// POST -> users/login
// it's a POST (and not a GET) because WE ARE CREATING A NEW SESSION model
// with express-session

// we use async again because we're using bcrypt to decrypt the password on the server
// to match it to the entered password

router.post('/login', async (req, res) => {
    // destructure username and password from the request body
    const { username, password } = req.body

    // search for user in db
    User.findOne({ username })
        // now it's time to invoke bcrypt for pw matching
        .then(async (user) => {
            // check if the user exists
            if (user) {
                // use bcrypt method compare() which will check the entered pw with the hashed one store ih the db
                // compare() returns truthy value
                const result = await bcrypt.compare(password, user.password)
            
            // if true, ir passwords match
                if (result) {
                    // create our own fields in express-session
                    req.session.username = username
                    req.session.loggedIn = true
                    req.session.userId = user.id
                    // and send a success response
                    res.status(201).json({ username: user.username })
                } else {
                    // if passwords don't match, respond with a message
                    res.json({ error: 'username or password is incorrect' })
                }
            } else {
                // if user does not exist
                res.json({ error: 'user does not exist' })
            }
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
})

// log out of their account

// DELETE -> /users/logout
// this route destroys the logged-in session in our db and browser

router.delete('/logout', (req, res) => {
    req.session.destroy(() => {
        console.log('this is req.session upon logout \n', req.session)
        // eventually redirect users here when we implement VIEW layer
        req.sendStatus(204)
    })
})

// *********** *********** *********** //
// Export Router                       //
// *********** *********** *********** //

module.exports = router