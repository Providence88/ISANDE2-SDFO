const express = require('express');
const Entry = require('../models/Entry');
const router = express.Router();

// Create Entry
router.post('/create', async (req, res) => {
    try {
        const entry = new Entry(req.body);
        await entry.save();
        res.redirect('/createDrugTestConsent'); // Updated to the correct path
    } catch (error) {
        res.status(400).send(error);
    }
});

// Edit Entry
router.post('/edit/:id', async (req, res) => {
    try {
        await Entry.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/editDrugTestConsent/${req.params.id}`); // Redirect to the correct edit page
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete Entry
router.post('/delete/:id', async (req, res) => {
    try {
        await Entry.findByIdAndDelete(req.params.id);
        res.redirect('/createDrugTestConsent'); // Redirect to the correct page after deletion
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get form for creating a new drug test consent (rendering Handlebars template)
router.get('/create', (req, res) => {
    res.render('createDrugTestConsent', { alphabet });
});

// Get form for editing an existing drug test consent (rendering Handlebars template)
router.get('/edit/:id', async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        if (!entry) {
            return res.status(404).send('Entry not found');
        }
        res.render('editDrugTestConsent', { entry, alphabet });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/drugTestConsentsList', async (req, res) => {
    try {
        // Fetch all entries from the database
        const entries = await Entry.find();
        
        res.render('drugTestConsentsList', { entries });
    } catch (error) {
        res.status(400).send(error);
    }
});


module.exports = router;
