// *********** *********** *********** //
// Comment Schema (Subdocument)        //
// *********** *********** *********** //

// SUBDOCUMENTS ARE NOT MONGOOSE MODELS

const mongoose = require('../utils/connection')

// don't need the model destructured
// because SUBDOCUMENTS ARE NOT MODELS

const { Schema } = mongoose

// create comment schema

const commentSchema = new Schema({
    note:{
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        fer: 'User',
        required: true
    }
}, {
    timestamps: true
})

// there is no model function 
// beacause SUBDOCUMENTS ARE NOT MONGOOSE MODELS

// *********** *********** *********** //
// Export Schema                       //
// *********** *********** *********** //

module.exports = commentSchema