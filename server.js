// *********** *********** *********** //
// Import Dependencies                 //
// *********** *********** *********** //

require('dotenv').config()
const express = require('express') 
const morgan = require('morgan') 
const mongoose = require('mongoose')
const path = require('path')

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

