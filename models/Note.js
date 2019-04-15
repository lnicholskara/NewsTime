var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    title: String,
    body: String,
    active: {
        type: Boolean,
        default: true
    }
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
