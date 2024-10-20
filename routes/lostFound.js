const express = require('express');
const LostFoundEntry = require('../models/LostFoundEntry');
const router = express.Router();

// Create Entry
router.post('/create', async (req, res) => {
    try {
        const entry = new LostFoundEntry(req.body);
        await entry.save();
        res.redirect('/module/lost-found');
    } catch (error) {
        res.status(400).send(error);
    }
});

// Edit Entry
router.post('/edit/:id', async (req, res) => {
    try {
        await LostFoundEntry.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/module/lost-found');
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete Entry
router.post('/delete/:id', async (req, res) => {
    try {
        await LostFoundEntry.findByIdAndDelete(req.params.id);
        res.redirect('/module/lost-found');
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
