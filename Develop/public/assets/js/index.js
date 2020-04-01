// html elements that need to be referenced
var $noteTitle = $(".note-title");   // title of note
var $noteText = $(".note-textarea");  // text of note
var $saveNoteBtn = $(".save-note");  // save note button
var $newNoteBtn = $(".new-note");  // start new note button
var $noteList = $(".list-container .list-group");

// activeNote is used to keep track of the note in the textarea
var activeNote = {};

// used to keep track of whether you are editting an existing note,
// or creating a new note.  
// true means an existing note is being editted; 
// false means a new note is being created
var editMode = false; 

// A function for getting all notes from the db
var getNotes = function() {
  return $.ajax({
    url: "/api/notes",  // url and method must match path & function in notetaker.js
    method: "GET"
  });
};

// A function for saving a note to the db
var saveNote = function(note) {
  console.log("========== begin saveNote =================");
  console.log("note...");
  console.log(note);
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};

// A function for updating a note to the db
var updateNote = function(note) {
  console.log("========== begin updateNote =================");
  console.log("note...");
  console.log(note);

  return deleteNote(note.id)
  .then(function() {
    saveNote(note);
  });
};

// A function for deleting a note from the db
var deleteNote = function(id) {
  console.log("========== begin deleteNote =================");
  console.log("id: " + id);
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  });
};

// If there is an activeNote, display it, otherwise render empty inputs
var renderActiveNote = function() {

  console.log("editMode: " + editMode);

  $saveNoteBtn.hide();  // only show save button when changes have been made to save

// display the note if it exists; 
// it can only be editted if editMode is true (meaning an existing note is being editted), 
// or if there is no active note
  if (activeNote.id) {
    if (editMode) {
      $noteTitle.attr("readonly", false);
      $noteText.attr("readonly", false);
    } else {
      $noteTitle.attr("readonly", true);
      $noteText.attr("readonly", true);
    };
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
  // characters to choose from
  const _sym = "abcdefghijklmnopqrstuvwxyz1234567890";
  var str = "";
  const numChar = 10;
// concatenate one random character at a time to the string to be returned
  for (var i = 0; i < numChar; i++) {
    str += _sym[parseInt(Math.random() * _sym.length)];
  }

  return str;
}

// Get the note data from the inputs, save it to the db and update the view
var handleNoteSave = function() {
  console.log("begin handleNoteSave");
  console.log("editMode: " + editMode);
  console.log("activeNote...");
  console.log(activeNote);

  var newNote = {
    title: $noteTitle.val(),
    text: $noteText.val(),
  };

  if (editMode) {
    newNote.id = activeNote.id;
    console.log("In if editMode of handeNoteSave");
    updateNote(newNote).then(function(data) {
      activeNote = {};  // reset - no active note
      editMode = false;  // not editting a current note
      getAndRenderNotes();
      renderActiveNote();
    });
  } else {
    newNote.id = generate();
    saveNote(newNote).then(function(data) {
      getAndRenderNotes();
      renderActiveNote();
    });
  };
};

// edit the clicked note
var handleNoteEdit = function(event) {
// prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  console.log("handleNoteEdit....");
  activeNote = $(this)
    .parent(".list-group-item")
    .data();

  console.log("activeNote:");
  console.log(activeNote);


  editMode = true;  // since current note is being editted
  renderActiveNote();
  console.log("end handleNoteEdit ....");

};

// Delete the clicked note
var handleNoteDelete = function(event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  var note = $(this)
    .parent(".list-group-item")
    .data();

// de-activate the note if the active one is the one being deleted
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
  activeNote = $(this)
    .parent(".list-group-item")
    .data();
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
  // clean out the note list
  $noteList.empty();
  var noteListItems = [];

// for each note, build the html li and append it.
  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    var $span = $(`<span class='display-note keyId' data-id='${note.id}'>`).text(note.title);
    var $editBtn = $(
      `<i class='fas fa-pen float-right edit-note keyId' data-id='${note.id}'>`
    );
    var $delBtn = $(
      `<i class='fas fa-trash-alt float-right text-danger delete-note keyId' data-id='${note.id}'>`
    );

    $li.append($span, $delBtn, $editBtn);
    noteListItems.push($li);

  }
// append the list of notes to the list in the html
  $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
var getAndRenderNotes = function() {
  return getNotes().then(function(data) {
    renderNoteList(data);
  });
};

// listen for any click event that needs to be handled.
$saveNoteBtn.on("click", handleNoteSave);   // Save a note
$noteList.on("click", ".display-note", handleNoteView);  // View a selected note
$newNoteBtn.on("click", handleNewNoteView);           // Start a new note
$noteList.on("click", ".delete-note", handleNoteDelete);  // delete a note
$noteList.on("click", ".edit-note", handleNoteEdit);  // edit a note
$noteTitle.on("keyup", handleRenderSaveBtn);   // display save button
$noteText.on("keyup", handleRenderSaveBtn);    // display save button

// Gets and renders the initial list of notes
getAndRenderNotes();