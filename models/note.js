//unused
const mongoose = require('mongoose')

const NoteSchema = mongoose.Schema({
    title:{required: true, type: String, unique:true},
    description:{required: true, type: String},
    author:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
})

const Note = mongoose.model('Note',NoteSchema,"notes")

module.exports = Note
