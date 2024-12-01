const express = require('express');
const Entry = require('../models/Entry');
const router = express.Router();

const moduleLinks = [
    { name: "Home", icon: "home.png", link: "/main" },
    { name: "Non Fraternity Contract", icon: "fraternity.png", link: "/nonFraternity/list" },
    { name: "Drug Test Consent Form", icon: "drug-test.png", link: "/drugTest/list" },
    { name: "Lost and Found", icon: "lost-luggage.png", link: "/lostFound/list" },
    { name: "Disciplinary Cases", icon: "gavel.png", link: "/disciplinary/list" },
    { name: "Students", icon: "graduation.png", link: "/studentList" },
    { name: "Log Out", icon: "log-out.png", link: "/logout" },
  ];

const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

// Render the "Create Drug Test Consent" page (GET)
router.get('/create', (req, res) => {
    res.render('createDrugTestConsent', {
        title: 'Create Drug Test Consent',
        moduleLinks,
        alphabet
    });
});

// Create Drug Test Consent (POST)
router.post('/create', async (req, res) => {
    try {
        const newEntry = new Entry(req.body);
        await newEntry.save();
        res.redirect('/drugTest/list'); // Redirect to the drug test consents list after successful creation
    } catch (error) {
        console.error(error);
        res.status(500).render('errorPage', { message: 'Error creating drug test consent.' });
    }
});

// Render Edit Drug Test Consent page (GET)
router.get('/edit/:id', async (req, res) => {
    try {
        const entryId = req.params.id;
        const entry = await Entry.findById(entryId);

        if (!entry) {
            return res.status(404).render('errorPage', { message: 'Drug test consent not found' });
        }

        res.render('editDrugTestConsent', {
            title: 'Edit Drug Test Consent',
            moduleLinks,
            entry,
            alphabet
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('errorPage', { message: 'Error retrieving drug test consent data' });
    }
});

// Edit Drug Test Consent (PUT)
router.put('/edit/:id', async (req, res) => {
    try {
        const updatedEntry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedEntry) {
            return res.status(404).json({ error: 'Entry not found or not updated' });
        }

        res.status(200).redirect(`/drugTest/list`);
    } catch (error) {
        console.error('Error updating entry:', error);
        res.status(400).json({ error: 'Error updating the entry' });
    }
});

// Delete Drug Test Consent (POST)
router.post('/delete/:id', async (req, res) => {
    try {
        await Entry.findByIdAndDelete(req.params.id);
        res.redirect('/drugTest/list'); // Redirect to the list after deletion
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

// Render Drug Test Consents List page (GET)
router.get('/list', async (req, res) => {
    try {
        const entries = await Entry.find();
        res.render('drugTestConsentsList', {
            title: 'Drug Test Consents List',
            entries,
            moduleLinks
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('errorPage', { message: 'Error retrieving drug test consents.' });
    }
});

module.exports = router;
