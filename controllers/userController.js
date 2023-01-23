// *********** *********** *********** //
// Import Dependencies                 //
// *********** *********** *********** //

const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// *********** *********** *********** //
// Create Router                       //
// *********** *********** *********** //

const router = express.Router();

// *********** *********** *********** //
// Routes                              //
// *********** *********** *********** //

// the user needs to be able to:
// create an account

// GET -> users/signup
// this route renders the signup page

router.get("/signup", (req, res) => {
    res.render("users/signup");
});

// POST -> users/signup
// this route creates new users in our db

// we use async because bcrypt needs to do its thing first once the info is submitted

router.post("/signup", async (req, res) => {
    // get a req.body and use that data to create a new user
    const newUser = req.body;
    // encrypt their password with bcrypt
    newUser.password = await bcrypt.hash(
        newUser.password,
        await bcrypt.genSalt(10)
    );
    User.create(newUser)
        .then((user) => {
            // iff success, respond with appropriate code and the username
            // DO NOT include password for security purposes
            res.redirect("/users/login");
        })
        .catch((err) => {
            //if error, handle error
            console.log(err);
            res.redirect(`/error?error=username%20taken`);
        });
});

// log in to their account

// GET -> users/login
// this route renders the login page

router.get("/login", (req, res) => {
    res.render("users/login");
});

// POST -> users/login
// it's a POST (and not a GET) because WE ARE CREATING A NEW SESSION model
// with express-session

// we use async again because we're using bcrypt to decrypt the password on the server
// to match it to the entered password

router.post("/login", async (req, res) => {
    // destructure username and password from the request body
    const { username, password } = req.body;

    // search for user in db
    User.findOne({ username })
        // now it's time to invoke bcrypt for pw matching
        .then(async (user) => {
            // check if the user exists
            if (user) {
                // use bcrypt method compare() which will check the entered pw with the hashed one store ih the db
                // compare() returns truthy value
                const result = await bcrypt.compare(password, user.password);

                // if true, ir passwords match
                if (result) {
                    // create our own fields in express-session
                    req.session.username = username;
                    req.session.loggedIn = true;
                    req.session.userId = user.id;
                    // and send a success response
                    // res.status(201).json({ username: user.username })
                    res.redirect("/");
                } else {
                    // if passwords don't match, respond with a message
                    // res.json({ error: 'username or password is incorrect' })
                    res.redirect(
                        `/error?error=username%20or%20password%20is%20incorrect`
                    );
                }
            } else {
                // if user does not exist
                res.redirect(`/error?error=user%20does%20not%20exist`);
            }
        })
        .catch((err) => {
            console.log(err);
            res.redirect(`/error?error=${err}`);
        });
});

// GET -> /users/logout
// This route renders a page that allows the user to log out
router.get("/logout", (req, res) => {
    res.render("users/logout");
});

// DELETE -> /users/logout
// this route destroys the logged-in session in our db and browser

router.delete("/logout", (req, res) => {
    req.session.destroy(() => {
        console.log("this is req.session upon logout \n", req.session);
        // eventually redirect users here when we implement VIEW layer
        res.redirect("/");
    });
});

// *********** *********** *********** //
// Export Router                       //
// *********** *********** *********** //

module.exports = router;
