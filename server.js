// *********** *********** *********** //
// Import Dependencies                 //
// *********** *********** *********** //

require('dotenv').config()
const express = require('express') 
const path = require('path')
const morgan = require('morgan') 
const Drum = require('./models/drum')
const middleware = require('./utils/middleware')
const drumRouter = require('./controllers/drumController')

// *********** *********** *********** //
// Create Express Application          //
// *********** *********** *********** //

const app = express()

// *********** *********** *********** //
// Middleware                          //
// *********** *********** *********** //

middleware(app)

// *********** *********** *********** //
// Routes                              //
// *********** *********** *********** //

app.get('/', (req, res) => {
    res.send('the server is running')
})

// register routes

app.use('/drums', drumRouter)

// *********** *********** *********** //
// Server Listener                     //
// *********** *********** *********** //

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listening on port ${PORT}`))