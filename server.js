// *********** *********** *********** //
// Import Dependencies                 //
// *********** *********** *********** //

require("dotenv").config();
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const middleware = require("./utils/middleware");
const DrumRouter = require("./controllers/drumController");
const UserRouter = require("./controllers/userController");
const CommentRouter = require("./controllers/commentController");

// *********** *********** *********** //
// Create Express Application          //
// *********** *********** *********** //

const app = require("liquid-express-views")(express());

// *********** *********** *********** //
// Middleware                          //
// *********** *********** *********** //

middleware(app);

// *********** *********** *********** //
// Routes                              //
// *********** *********** *********** //

// 'Home' route

app.get("/", (req, res) => {
  res.render("home.liquid", { ...req.session });
});

// register routes

app.use("/drums", DrumRouter);
app.use("/users", UserRouter);
app.use("/comments", CommentRouter);

// *********** *********** *********** //
// Server Listener                     //
// *********** *********** *********** //

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
