// models/Entry.js
const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    idNumber: { type: String, required: true },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    middleInitial: { type: String, required: true },
    cellphoneNumber: { type: String, required: true },
    schoolEmail: { type: String, required: true },
    signature: { type: Boolean, required: true },
    consent: { type: Boolean, required: true },
    submitted: { type: Boolean, required: true },
});

const Entry = mongoose.model('Entry', entrySchema);
module.exports = Entry;
