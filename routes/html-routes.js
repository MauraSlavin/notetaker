const path = require('path');
const router = require('express').Router();

// HTML GET Requests

// Web page when the Get Started button is clicked.
router.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "../Develop/public/notes.html"));
});

// If no matching route is found default to home
router.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "../Develop/public/index.html"));
});

module.exports = router;