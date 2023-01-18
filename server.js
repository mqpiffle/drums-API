// *********** *********** *********** //
// Import Dependencies                 //
// *********** *********** *********** //

require('dotenv').config()
const express = require('express') 
const morgan = require('morgan') 
const mongoose = require('mongoose')
const path = require('path')
const Drum = require('./models/drum')

// *********** *********** *********** //
// Database Connection                 //
// *********** *********** *********** //

const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(DATABASE_URL, CONFIG)

mongoose.connection
    .on('open', () => console.log('Connected to mongoose'))
    .on('close', () => console.log('Disconnected from mongoose'))
    .on('error', (err) => console.log(err))

// *********** *********** *********** //
// Create Express Application          //
// *********** *********** *********** //

const app = express()

// *********** *********** *********** //
// Middleware                          //
// *********** *********** *********** //

app.use(morgan('tiny')) // logging
app.use(express({ extended: true })) // parse urlencoded request bodies
app.use(express.static('public')) // serve files from public statically
app.use(express.json()) // parses incoming requests with JSON payloads

// *********** *********** *********** //
// Routes                              //
// *********** *********** *********** //

app.get('/', (req, res) => {
    res.send('the server is running')
})

// *********** *********** *********** //
// Server Listener                     //
// *********** *********** *********** //

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listening on port ${PORT}`))