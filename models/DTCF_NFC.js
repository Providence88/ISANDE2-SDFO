// models/DTCF_NFC

const mongoose = require('mongoose');

const dtcfNfcSchema = new mongoose.Schema({
    idNumber: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    middleInitial: {
        type: String,
        required: true
    },
    cellphoneNumber: {
        type: String,
        required: true
    },
    schoolEmail: {
        type: String,
        required: true
    },
    signature: {
        type: Boolean,
        required: true
    },
    submittedNFC: {
        type: Boolean,
        required: true
    },
    
    consentDTCF: {
        type: Boolean,
        required: true
    },
    submittedDTCF: {
        type: Boolean,
        required: true
    }
});

const DTCF_NFC = mongoose.model('DTCF_NFC', dtcfNfcSchema, 'DTCF_NFC');

module.exports = DTCF_NFC;
