// models/LostFoundEntry.js
const mongoose = require('mongoose');

const lostFoundEntrySchema = new mongoose.Schema({
    itemId: { type: String, required: true },
    itemName: { type: String, required: true },
    locationFound: { type: String, required: true },
    dateTimeFound: { type: Date, required: true },
    confirmedBy: { type: String, required: true },
    claimed: { type: Boolean, required: true },
    claimedBy: { type: String },
    claimConfirmedBy: { type: String },
    dateClaimed: { type: Date },
});

const LostFoundEntry = mongoose.model('LostFoundEntry', lostFoundEntrySchema);
module.exports = LostFoundEntry;
