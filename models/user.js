// *********** *********** *********** //
// User Schema and Models              //
// *********** *********** *********** //

const mongoose = require('../utils/connection')

const { Schema, model } = mongoose

// *********** *********** *********** //
// Define User Schema and Create Model //
// *********** *********** *********** //

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = model('User', userSchema)

// *********** *********** *********** //
// Export Model                        //
// *********** *********** *********** //

module.export = User