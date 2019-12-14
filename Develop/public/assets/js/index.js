console.log("In INDEX.JS");

var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $noteList = $(".list-container .list-group");

// activeNote is used to keep track of the note in the textarea
var activeNote = {};

// A function for getting all notes from the db
var getNotes = function() {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};

// A function for saving a note to the db
var saveNote = function(note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};

// A function for deleting a note from the db
var deleteNote = function(id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  });
};

// If there is an activeNote, display it, otherwise render empty inputs
var renderActiveNote = function() {
  $saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

// Random id generator based on code from
//    https://stackoverflow.com/questions/23327010/how-to-generate-unique-id-with-node-js
function generate() {
  const _sym = "abcdefghijklmnopqrstuvwxyz1234567890";
  var str = "";
  const numChar = 10;

  for (var i = 0; i < numChar; i++) {
    str += _sym[parseInt(Math.random() * _sym.length)];
  }

  return str;
}

// Get the note data from the inputs, save it to the db and update the view
var handleNoteSave = function() {
  console.log("begin handleNoteSave");
  var newNote = {
    title: $noteTitle.val(),
    text: $noteText.val(),
    id:  generate()
  };

  saveNote(newNote).then(function(data) {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
var handleNoteDelete = function(event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();
  console.log($(this).attr("data-id"));

  var note = $(this)
    .parent(".list-group-item")
    .data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(function() {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
var handleNoteView = function() {
  activeNote = $(this).data();
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
var handleNewNoteView = function() {
  activeNote = {};
  renderActiveNote();
};

// If a note's title or text are empty, hide the save button
// Or else show it
var handleRenderSaveBtn = function() {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// Render's the list of note titles
var renderNoteList = function(notes) {
  console.log("\nbegin renderNoteList");
  console.log("Passed in: notes");
  console.log(notes);
  $noteList.empty();

  var noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];
    console.log("\nnote:");
    console.log(note);

    var $li = $("<li class='list-group-item'>").data(note);
    // var $id = $("<span class='id d-none'>").text(note.id);
    var $span = $(`<span class='keyId' data-id='${note.id}'>`).text(note.title);
    var $delBtn = $(
      `<i class='fas fa-trash-alt float-right text-danger delete-note keyId' data-id='${note.id}'>`
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);

  }

  $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
var getAndRenderNotes = function() {
  console.log("getAndRenderNotes");
  return getNotes().then(function(data) {
    renderNoteList(data);
  });
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();