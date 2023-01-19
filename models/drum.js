// *********** *********** *********** //
// Drum Schema and Models              //
// *********** *********** *********** //

const { default: mongoose } = require("mongoose");

// pull schema and model from mongoose
const { Schema, model } = mongoose

// drums schema (properties for a set of drums)
const drumsSchema = new Schema({
    manufacturer: {
        type: String
    },
    model: {
        type: String
    },
    finish: {
        type: String
    },
    pieces: {
        type: Number
    },
    priceUSD: {
        type: Number
    },
    custom: {
        type: Boolean
    },
    owner: {
        // this is where we setup an object id reference
        // by declareding that as the type
        type: Schema.Types.ObjectId,
        // look at this model
        ref: 'User'
    }
}, {
    timestamps: true
})

// create model
const Drum = model('Drum', drumsSchema)

module.exports = Drum;