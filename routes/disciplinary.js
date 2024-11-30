const express = require('express');
const DisciplinaryCase = require('../models/DisciplinaryCase');
const router = express.Router();

// Create Disciplinary Case (POST)
router.post('/createDisciplinaryCase', async (req, res) => {
    try {
        // Assuming req.body contains all the form data sent from the form
        const newCase = new DisciplinaryCase(req.body);

        // Save the new case to the database
        await newCase.save();
        res.status(201).json({ message: 'Disciplinary case created successfully!' });
        // Redirect to the disciplinary cases list or another page
        res.redirect('/createDisciplinaryCase');
    } catch (error) {
        res.status(400).send(error);
    }
});

// Edit Case
router.put('/editDisciplinaryCase/:id', async (req, res) => {
    try {
        const updatedCase = await DisciplinaryCase.findByIdAndUpdate(req.params.id, req.body);

        if (updatedCase){
            res.redirect('/editDisciplinaryCase');
        } else {
            res.status(404).json({ error: 'Case not edited.' });
        }
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