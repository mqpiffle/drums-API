// *********** *********** *********** //
// Import Dependencies                 //
// *********** *********** *********** //

const express = require('express')
const Drum = require('../models/drum')

// *********** *********** *********** //
// Create Router                       //
// *********** *********** *********** //

const router = express.Router()

// *********** *********** *********** //
// Routes                              //
// *********** *********** *********** //


// INDEX Route (REST)
// coresponds to READ (CRUD) -> finds and displays all fruits

router.get('/', (req, res) => {
    // find all of the drums
    Drum.find({})
        .populate('owner', '-password')
        .then(drums => {
            res.status(200).json({ drums: drums })
        })
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
})

// CREATE route (REST)
// corresponds to CREATE (CRUD) ->  creates a new document in the database

router.post('/', (req, res) => {
    // req.body.owner = req.session.userId
    const newDrum = req.body
    Drum.create(newDrum)
        .then(drum => {
            res.status(201).json({ drum: drum.toObject() })
        })
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
})

// INDEX MINE
// corresponds to READ (CRUD) -> finds and displays all auth'd user's drums

router.get('/mine', (req, res) => {
    // find all documents with an owner field = the auth'd user's id
    Drum.find({ owner: req.session.userId })
        .then(drums => {
            res.status(200).json({ drums: drums })
        })
    .catch(err => {
        console.log(err)
        res.status(400).json(err)
    })
})


// UPDATE route (REST)
// corresponds to UPDATE (CRUD) -> updates and exising document

router.put('/:id', (req, res) => {
    const id = req.params.id
    Drum.findById(id)
        .then(drum => {
            // if the owner of the drum is the person who's logged in
            if (drum.owner == req.session.userId) {
                res.sendStatus(204)
                return drum.updateOne(req.body)
            } else {
                res.sendStatus(401)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})

// DELETE route (REST)
// corresponds to DELETE (CRUD) -> deletes a specific route

router.delete('/:id', (req, res) => {
    const id = req.params.id
    Drum.findById(id)
        .then(drum => {
            res.sendStatus(204)
            return drum.deleteOne()
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})

// SHOW route
// corresponds to READ (CRUD) -> find and display a single resource

router.get('/:id', (req, res) => {
    const id = req.params.id
    Drum.findById(id)
        .then(drum => {
            res.status(204).json({ drum: drum })
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})

// *********** *********** *********** //
// Export Router                       //
// *********** *********** *********** //

module.exports = router