const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    user: {
        type: Schema.Types.String
    },
    body: {
        type: Schema.Types.String
    }
});

const Note = mongoose.model("Note", NoteSchema);
module.exports = Note;