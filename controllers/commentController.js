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

// we only need to POST and DELETE comments (for now)

// SUBDOCUMENTS ARE NOT MONGOOSE MODELS
// therefore when we create a subdocument -> refer to the parent so mongoose knows where in mongodb to store the subdocument

// POST -> '/comments/<someDrumId>'
// only logged in users may post comments b/c author field is required in commentSchema
// refer to which drum in route by passing in the id of the drum

router.post("/:drumId", (req, res) => {
    // get drumId
    const { drumId } = req.params;
    const theComment = req.body;
    // protect the route against not-logged-in users
    if (req.session.loggedIn) {
        // make logged-in user the author of the comment
        req.body.author = req.session.userId;
        // find a specific drum document
        Drum.findById(drumId)
            // then, for the drum with that id
            .then((drum) => {
                // add the comment assigned in req.body
                // (make sure comments array is added to drumSchema)
                drum.comments.push(theComment);
                // save the drum to the db
                return drum.save();
            })
            // then, respond with a 201 amd the drum's json
            .then((drum) => {
                res.redirect(`/drums/${drum.id}`);
            })
            .catch((err) => {
                console.log(err);
                res.redirect(`/error?error=${err}`);
            });
    } else {
        // escape our route by sending a response
        res.redirect(
            `/error?error=You%20Are%20not%20allowed%20to%20comment%20on%20this`
        );
    }
});

// DELETE => '/comments/delete/<someDrumId>/<someCommentId>
// make sure only the author of the comment may delete the comment

router.delete("/delete/:drumId/:commentId", (req, res) => {
    // vars from params
    const { drumId, commId } = req.params;
    // get the drum
    Drum.findById(drumId)
        .then((drum) => {
            // get the comment using buit-in subdoc method .id()
            const theComment = drum.comments.id(commId);
            console.log("this is the comment to be deleted \n", theComment);
            // if the user is logged in and they are author of the comment
            if (req.session.loggedIn) {
                // if they are the author, allow them to delete
                if (theComment.author == req.session.userId) {
                    // we can use another built-in method remove()
                    theComment.remove();
                    drum.save();
                    res.redirect(`/drums/${drum.id}`);
                } else {
                    // otherwise send a 401 unauthorized status
                    res.redirect(
                        `/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20comment`
                    );
                }
            } else {
                // otherwise send a 401 unauthorized status
                res.redirect(
                    `/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20comment`
                );
            }
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
