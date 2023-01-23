// *********** *********** *********** //
// Import Dependencies                 //
// *********** *********** *********** //

const express = require("express");
const Drum = require("../models/drum");

// *********** *********** *********** //
// Create Router                       //
// *********** *********** *********** //

const router = express.Router();

// *********** *********** *********** //
// Routes                              //
// *********** *********** *********** //

// INDEX Route (REST)
// coresponds to READ (CRUD) -> finds and displays all fruits

router.get("/", (req, res) => {
    // find all of the drums
    Drum.find({})
        .populate("owner", "username")
        .populate("comments.author", "-password")
        .then((drums) => {
            res.render("drums/index", { drums, ...req.session });
        })
        .catch((err) => {
            console.log(err);
            res.redirect(`/error?error=${err}`);
        });
});

// GET for the new page
// shows a form where a user can create a new fruit
router.get("/new", (req, res) => {
    res.render("drums/new", { ...req.session });
});

// CREATE route (REST)
// corresponds to CREATE (CRUD) ->  creates a new document in the database

router.post("/", (req, res) => {
    req.body.owner = req.session.userId;
    const newDrum = req.body;
    Drum.create(newDrum)
        .then((drum) => {
            res.redirect(`/drums/${drum.id}`);
        })
        .catch((err) => {
            console.log(err);
            res.redirect(`/error?error=${err}`);
        });
});

// INDEX MINE
// corresponds to READ (CRUD) -> finds and displays all auth'd user's drums

router.get("/mine", (req, res) => {
    // find all documents with an owner field = the auth'd user's id

    Drum.find({ owner: req.session.userId })
        .populate("owner", "username")
        .populate("comments.author", "-password")
        .then((drums) => {
            res.render("drums/index", { drums, ...req.session });
        })
        .catch((err) => {
            console.log(err);
            res.redirect(`/error?error=${err}`);
        });
});

// GET route for getting json for specific user drums
// Index -> This is a user specific index route
// this will only show the logged in user's drums
router.get("/json", (req, res) => {
    // find fruits by ownership, using the req.session info
    Drum.find({ owner: req.session.userId })
        .populate("owner", "username")
        .populate("comments.author", "-password")
        .then((drums) => {
            // if found, display the fruits
            res.status(200).json({ drums: drums });
            // res.render('fruits/index', { fruits, ...req.session })
        })
        .catch((err) => {
            // otherwise throw an error
            console.log(err);
            res.status(400).json(err);
        });
});

// GET request -> edit route
// shows the form for updating a fruit
router.get("/edit/:id", (req, res) => {
    // because we're editing a specific fruit, we want to be able to access the fruit's initial values. so we can use that info on the page.
    const drumId = req.params.id;
    Drum.findById(drumId)
        .then((drum) => {
            res.render("drums/edit", { drum, ...req.session });
        })
        .catch((err) => {
            res.redirect(`/error?error=${err}`);
        });
});

// UPDATE route (REST)
// corresponds to UPDATE (CRUD) -> updates and exising document

router.put("/:id", (req, res) => {
    const id = req.params.id;
    Drum.findById(id)
        .then((drum) => {
            // if the owner of the drum is the person who's logged in
            if (drum.owner == req.session.userId) {
                // res.sendStatus(204)
                return drum.updateOne(req.body);
            } else {
                res.redirect(
                    `/error?error=You%20Are%20not%20allowed%20to%20edit%20this%20drum`
                );
            }
        })
        .catch((err) => {
            console.log(err);
            res.redirect(`/error?error=${err}`);
        });
});

// DELETE route (REST)
// corresponds to DELETE (CRUD) -> deletes a specific route

router.delete("/:id", (req, res) => {
    const id = req.params.id;
    Drum.findById(id)
        .then((drum) => {
            if (drum.owner == req.session.userId) {
                // res.sendStatus(204)
                return drum.deleteOne();
            } else {
                res.redirect(
                    `/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20drum`
                );
            }
        })
        .then(() => {
            res.redirect("/drums/mine");
        })
        .catch((err) => {
            console.log(err);
            res.redirect(`/error?error=${err}`);
        });
});

// SHOW route
// corresponds to READ (CRUD) -> find and display a single resource

router.get("/:id", (req, res) => {
    const id = req.params.id;
    Drum.findById(id)
        .populate("comments.author", "username")
        .then((drum) => {
            res.render("drums/show.liquid", { drum, ...req.session });
        })
        .catch((err) => {
            console.log(err);
            res.redirect(`/error?error=${err}`);
        });
});

// *********** *********** *********** //
// Export Router                       //
// *********** *********** *********** //

module.exports = router;
