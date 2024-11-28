const express = require('express');
const DisciplinaryCase = require('../models/DisciplinaryCase');
const router = express.Router();

// Create Disciplinary Case (POST)
router.post('/createDisciplinaryCase', async (req, res) => {
    try {
        // Assuming req.body contains all the form data sent from the form
        const { complainantId, complainantName, complainantEmail, respondentId, respondentName, respondentEmail, currentLevelOfEscalation, confirmedBy } = req.body;
        
        const newCase = new DisciplinaryCase({
            complainantId,
            complainantName,
            complainantEmail,
            respondentId,
            respondentName,
            respondentEmail,
            currentLevelOfEscalation,
            confirmedBy
        });

        // Save the new case to the database
        await newCase.save();

        // Redirect to the disciplinary cases list or another page
        res.redirect('/createDisciplinaryCase');
    } catch (error) {
        res.status(400).send(error);
    }
});

// Edit Case
router.post('/edit/:id', async (req, res) => {
    try {
        await DisciplinaryCase.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('editDisciplinaryCase');
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete Case
router.post('/delete/:id', async (req, res) => {
    try {
        await DisciplinaryCase.findByIdAndDelete(req.params.id);
        res.redirect('/createDisciplinaryCase');
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;