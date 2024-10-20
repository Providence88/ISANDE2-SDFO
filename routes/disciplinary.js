const express = require('express');
const DisciplinaryCase = require('../models/DisciplinaryCase');
const router = express.Router();

// Create Case
router.post('/create', async (req, res) => {
    try {
        const caseEntry = new DisciplinaryCase(req.body);
        await caseEntry.save();
        res.redirect('/module/disciplinary-cases');
    } catch (error) {
        res.status(400).send(error);
    }
});

// Edit Case
router.post('/edit/:id', async (req, res) => {
    try {
        await DisciplinaryCase.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/module/disciplinary-cases');
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete Case
router.post('/delete/:id', async (req, res) => {
    try {
        await DisciplinaryCase.findByIdAndDelete(req.params.id);
        res.redirect('/module/disciplinary-cases');
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
