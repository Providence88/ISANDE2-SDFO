// models/nonFratContract.js

const mongoose = require('mongoose');

const nonFratContractSchema = new mongoose.Schema({
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
    submitted: {
        type: Boolean,
        required: true
    }
});

const NonFratContract = mongoose.model('NonFratContract', nonFratContractSchema, 'nonFratContracts');

module.exports = NonFratContract;
