// models/DisciplinaryCase.js
const mongoose = require('mongoose');

const disciplinaryCaseSchema = new mongoose.Schema({
    complainantId: { type: String, required: true },
    complainantName: { type: String, required: true },
    complainantEmail: { type: String, required: true },
    respondentId: { type: String, required: true },
    respondentName: { type: String, required: true },
    respondentEmail: { type: String, required: true },
    currentLevelOfEscalation: { type: String, required: true, enum: ['Investigation', 'Further Assessment', 'Evaluation', 'Hearing', 'Mediation', 'On-Going', 'Solved'] },
    confirmedBy: { type: String, required: true },
});

const DisciplinaryCase = mongoose.model('DisciplinaryCase', disciplinaryCaseSchema);
module.exports = DisciplinaryCase;
