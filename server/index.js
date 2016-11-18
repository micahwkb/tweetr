"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const sass          = require("node-sass");
const app           = express();
const fs            = require("fs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

sass.render({
  file: "./sass/style.scss",
  outputStyle: "compressed",
}, (err, data) => {
  if(!err) {
    fs.writeFile("./public/style.css", data.css, (err) => {
      if(!err) {
        console.log("Successfully compiled SCSS");
      } else console.log(err);
    });
  } else console.log(err);
});
// The in-memory database of tweets. It's a basic object with an array in it.
// const db = require("./lib/in-memory-db");
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  // Connection to "tweeter" db was successful
  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  const DataHelpers = require("./lib/data-helpers.js")(db);

  const tweetsRoutes = require("./routes/tweets")(DataHelpers);

  app.use("/tweets", tweetsRoutes);

  app.listen(PORT, () => {
    console.log("Example app listening on port " + PORT);
  });


});
// The `data-helpers` module provides an interface to the database of tweets.
// This simple interface layer has a big benefit: we could switch out the
// actual database it uses and see little to no changes elsewhere in the code
// (hint hint).
//
// Because it exports a function that expects the `db` as a parameter, we can
// require it and pass the `db` parameter immediately:


// The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
// so it can define routes that use it to interact with the data layer.

// const tweetsRoutes = require("./routes/tweets")(DataHelpers);

// Mount the tweets routes at the "/tweets" path prefix:



