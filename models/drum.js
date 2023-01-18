// *********** *********** *********** //
// Models                              //
// *********** *********** *********** //

const { default: mongoose } = require("mongoose");

// pull schema and model from mongoose
const { Schema, model } = mongoose

// drums schema (properties for a set of drums)
const drumsSchema = new Schema({
    name: String,
    finish: String,
    pieces: Number,
    priceUSD: Number,
    custom: Boolean
})

// create model
const Drum = model('Drum', drumsSchema)

module.exports = Fruit;