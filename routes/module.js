const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');

// Create Entry
router.post('/:module/create', async (req, res) => {
    try {
        const newEntry = new Entry(req.body);
        await newEntry.save();
        res.redirect(`/module/${req.params.module}`);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Edit Entry
router.post('/:module/edit/:id', async (req, res) => {
    try {
        await Entry.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/module/${req.params.module}`);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete Entry
router.post('/:module/delete/:id', async (req, res) => {
    try {
        await Entry.findByIdAndDelete(req.params.id);
        res.redirect(`/module/${req.params.module}`);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get Entry for Editing
router.get('/:module/edit/:id', async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        res.render('entryForm', {
            module: req.params.module,
            action: 'Edit',
            isEdit: true,
            entry: entry,
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get All Entries for the Module
router.get('/:module', async (req, res) => {
    try {
        // Retrieve entries based on the module type
        const entries = await Entry.find({});
        
        // Use different templates based on the module
        const templateName = req.params.module === 'lost-found' 
            ? 'lostFoundEntriesList' 
            : 'disciplinaryCasesList'; // Change this based on your modules

        res.render(templateName, {
            module: req.params.module,
            entries: entries,
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
