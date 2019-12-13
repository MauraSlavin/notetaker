// ==============================================================================
// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
// ==============================================================================

const express = require("express");
const path = require("path");
const fs = require("fs");

// ==============================================================================
// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server
// ==============================================================================

// Tells node that we are creating an "express" server
var app = express();

// *******************************
// do we need bodyParser ??
//****************** */
app.use(express.static(path.join(__dirname, "Develop/public")));
// var bodyParser = require('body-parser');

// // configure app to use bodyParser()
// // this will let us get the data from a POST
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 8080;

// Initialize notesData
let notesData = [];
//test data
// let notesData = [
//   { title: "first note", text: "stuff", id: "xyz" },
//   { title: "second note", text: "more stuff", id: "vwx" }
// ];

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ================================================================================
// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs.
// ================================================================================


app.get("/api/notes", function(err, res) {
  let data;  // this is defined before the try/catch block so it still exists outside the block
  try {
    data = fs.readFileSync("Develop/db/db.json", "utf8");
    data = JSON.parse(data);
    // NOW data is an array of objects!!  Yay!!
  } catch (err) {
    console.log("\n error (in app.get.catch):");
    console.error(err);
  }
  // this has to be outside of the try/catch block.  Scoping??
  // send objects to browser
  res.json(data);
});


app.post("/api/notes", function(req, res) {

  try {
    let data = fs.readFileSync("Develop/db/db.json", "utf8");
    data = JSON.parse(data);
    // NOW data is an array of objects!!  Yay - progress!!
    notesData.push(req.body);
    res.json(notesData);
    // res.JSON(data);   // this doesn't work
    // console.log(notesData);
  } catch (err) {
    console.log("\n error (in app.get.catch):");
    console.error(err);
  }

  // console.log(data);
  // notesData.json(data); // this doesn't work
});

// Delete a note
app.delete("/api/notes/:id", function(req, res) {});

// HTML GET Requests
// Below code handles when users "visit" a page.
// In each of the below cases the user is shown an HTML page of content
// ---------------------------------------------------------------------------

// app.get("/notes", function(req, res) {
//   // res.sendFile("c/Users/maura/bootcamp/homework/notetaker/Develop/public/notes.html");
//   // res.sendFile("C:/Windows/Users/maura/bootcamp/homework/notetaker/Develop/public/notes.html");
//   res.sendFile(path.join(__dirname, "../Develop/public/notes.html"));
// });

// If no matching route is found default to home
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
});

// If no matching route is found default to home
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});

// Delete a note
app.delete("/api/notes/:id", function(req, res) {
  // code to delete a note goes here.
});

// =============================================================================
// LISTENER
// The below code effectively "starts" our server
// =============================================================================

app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
