const express = require('express');
const Entry = require('../models/Entry');
const router = express.Router();

// Create Entry
router.post('/create', async (req, res) => {
    try {
        const entry = new Entry(req.body);
        await entry.save();
        res.redirect('/module/drug-test');
    } catch (error) {
        res.status(400).send(error);
    }
});

// Edit Entry
router.post('/edit/:id', async (req, res) => {
    try {
        await Entry.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/module/drug-test');
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete Entry
router.post('/delete/:id', async (req, res) => {
    try {
        await Entry.findByIdAndDelete(req.params.id);
        res.redirect('/module/drug-test');
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
