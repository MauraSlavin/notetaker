// need express to interact with the front end
const express = require("express");
// need path for filename paths
const path = require("path");

const routes = require('./routes'); // api routes


// Tells node that we are creating an "express" server
var app = express();

// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 8080;

// Initialize notesData
let notesData = [];

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// sets up the default directory to use in the html files
app.use(express.static(path.join(__dirname, "Develop/public")));

// routes
app.use('/', routes);

// start the server
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
