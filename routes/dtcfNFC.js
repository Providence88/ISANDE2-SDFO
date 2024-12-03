const express = require('express');
const Entry = require('../models/DTCF_NFC');
const router = express.Router();

const moduleLinks = [
    { name: "Home", icon: "home.png", link: "/main" },
    { name: "Non Fraternity Contract", icon: "fraternity.png", link: "/dtcfNFC/list" },
    { name: "Drug Test Consent Form", icon: "drug-test.png", link: "/dtcfNFC/list" },
    { name: "Lost and Found", icon: "lost-luggage.png", link: "/lostFound/list" },
    { name: "Disciplinary Cases", icon: "gavel.png", link: "/disciplinary/list" },
    { name: "Students", icon: "graduation.png", link: "/studentList" },
    { name: "Log Out", icon: "log-out.png", link: "/logout" },
];

const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

// Render Create Page (GET)
router.get('/create', (req, res) => {
    res.render('createDTCF_NFC', {
        title: 'Create DTCF and NFC Record',
        moduleLinks,
        alphabet,
    });
});

// Handle Create Request (POST)
router.post('/create', async (req, res) => {
    try {
        // Convert booleans
        const formData = {
            ...req.body,
            signature: req.body.signature === 'true',
            submittedNFC: req.body.submittedNFC === 'true',
            consentDTCF: req.body.consentDTCF === 'true',
            submittedDTCF: req.body.submittedDTCF === 'true',
        };

        const newEntry = new Entry(formData);
        await newEntry.save();
        res.redirect('/dtcfNFC/list');
    } catch (error) {
        console.error('Error creating drug test consent:', error);
        res.status(500).render('errorPage', { message: 'Error creating drug test consent.' });
    }
});

// Render Edit Page (GET)
router.get('/edit/:id', async (req, res) => {
    try {
        const consentId = req.params.id;
        const consentForm = await Entry.findById(consentId);

        if (!consentForm) {
            return res.status(404).render('errorPage', { message: 'Consent form not found.' });
        }

        res.render('editDTCF_NFC', {
            moduleLinks,
            consentId,
            ...consentForm.toObject(),
            alphabet,
        });
    } catch (error) {
        console.error('Error fetching consent form:', error);
        res.status(500).render('errorPage', { message: 'Error retrieving consent form.' });
    }
});

// Handle Edit Request (POST)
router.post('/edit/:id', async (req, res) => {
    try {
        const consentId = req.params.id;

        // Convert booleans
        const updatedData = {
            ...req.body,
            signature: req.body.signature === 'true',
            submittedNFC: req.body.submittedNFC === 'true',
            consentDTCF: req.body.consentDTCF === 'true',
            submittedDTCF: req.body.submittedDTCF === 'true',
        };

        // Validate input
        if (!updatedData.idNumber || !updatedData.lastName || !updatedData.firstName || !updatedData.middleInitial || !updatedData.cellphoneNumber || !updatedData.schoolEmail || updatedData.signature === undefined || updatedData.consentDTCF === undefined || updatedData.submittedDTCF === undefined) {
            return res.status(400).render('errorPage', { message: 'All fields are required.' });
        }

        const updatedConsentForm = await Entry.findByIdAndUpdate(consentId, updatedData, { new: true });

        if (!updatedConsentForm) {
            return res.status(404).render('errorPage', { message: 'Consent form not found.' });
        }

        res.redirect('/dtcfNFC/list');
    } catch (error) {
        console.error('Error updating consent form:', error);
        res.status(500).render('errorPage', { message: 'Error updating consent form.' });
    }
});

// Render Drug Test Consents List (GET)
router.get('/list', async (req, res) => {
    try {
        const { idFilter, signature, consent, submitted } = req.query;

        // Build the filter object
        const filter = {};
        if (idFilter) filter.idNumber = { $regex: `^${idFilter}`, $options: 'i' }; // Prefix match, case-insensitive
        if (signature) filter.signature = signature;
        if (consent) filter.consentDTCF = consent; // Changed to match consentDTCF
        if (submitted) filter.submittedDTCF = submitted; // Changed to match submittedDTCF

        const entries = await Entry.find(filter);

        res.render('DTCF_NFC_LIST', {
            title: 'DTCF NFC List',
            entries,
            moduleLinks,
            filter,
        });
    } catch (error) {
        console.error('Error retrieving drug test consents:', error);
        res.status(500).render('errorPage', { message: 'Error retrieving drug test consents.' });
    }
});

module.exports = router;
