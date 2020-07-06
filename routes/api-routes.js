// need express to interact with the front end
const router = require("express").Router();
// need fs to read and write to files
const fs = require("fs");

// routes
// const app = express();

// responding to the api call for all the notes, and sends results to the browser as an array of objects
router.get("/notes", function(err, res) {
  try {
    // reads the notes from the json file.
    notesData = fs.readFileSync("Develop/db/db.json", "utf8");
    // parses it so notesData is an array of objects
    notesData = JSON.parse(notesData);

    // error handling
  } catch (err) {
    console.log("\n error (in router.get.catch):");
    console.error(err);
  }
  // this has to be outside of the try/catch block.  Scoping??
  // send objects to browser
  // notesData is an array of objects
  res.json(notesData);
});

// writes the new note to the json file
router.post("/notes", function(req, res) {
  try {
    // reads the json file
    notesData = fs.readFileSync("./Develop/db/db.json", "utf8");
    // parses the data to get an array of objects
    notesData = JSON.parse(notesData);
    // add the new note to the array of note objects
    notesData.push(req.body); // req.body - user input
    // make it a string (stringify) so you can write it to the file
    notesData = JSON.stringify(notesData);
    console.log(notesData);
    // write the new notes to the file
    fs.writeFile("./Develop/db/db.json", notesData, "utf8", function(err) {
      // error handling
      if (err) throw err;
    });

    // change it back to an array of objects & send it back to the browser (client)
    res.json(JSON.parse(notesData)); // returning data to client (browser)

    // error handling
  } catch (err) {
    throw err;
    console.error(err);
  }
});

// Delete a note
router.delete("/notes/:id", function(req, res) {
  try {
    // reads the json file
    notesData = fs.readFileSync("./Develop/db/db.json", "utf8");
    // parses the data to get an array of objects
    notesData = JSON.parse(notesData);
    // delete the old note from the array of note objects

    // based on code from...
    //   ... https://stackoverflow.com/questions/10024866/remove-object-from-array-using-javascript
    notesData = notesData.filter(function(note) {
      return note.id != req.params.id;
    });

    // make it a string (stringify) so you can write it to the file
    notesData = JSON.stringify(notesData);
    // write the new notes to the file
    fs.writeFile("./Develop/db/db.json", notesData, "utf8", function(err) {
      // error handling
      if (err) throw err;
    });

    // change it back to an array of objects & send it back to the browser (client)
    res.json(JSON.parse(notesData)); // returning data to client (browser)

    // error handling
  } catch (err) {
    throw err;
    console.error(err);
  }
});

module.exports = router;