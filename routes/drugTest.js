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

router.get('/edit/:id', (req, res) => {
    const consentId = req.params.id;

    Entry.findById(consentId)
        .then(consentForm => {
            if (!consentForm) {
                return res.status(404).send('Consent form not found');
            }

            res.render('editDrugTestConsent', {
                moduleLinks,
                consentId: consentId,
                idNumber: consentForm.idNumber,
                lastName: consentForm.lastName,
                firstName: consentForm.firstName,
                middleInitial: consentForm.middleInitial,
                cellphoneNumber: consentForm.cellphoneNumber,
                schoolEmail: consentForm.schoolEmail,
                signature: consentForm.signature,
                consent: consentForm.consent,
                submitted: consentForm.submitted,
                alphabet
            });
        })
        .catch(err => {
            console.error('Error fetching consent form:', err);
            res.status(500).send('Error retrieving consent form');
        });
});

// Route to handle updating the drug test consent form
router.post('/edit/:id', (req, res) => {
    const { idNumber, lastName, firstName, middleInitial, cellphoneNumber, schoolEmail, signature, consent, submitted } = req.body;
    const consentId = req.params.id;

    // Validate the input
    if (!idNumber || !lastName || !firstName || !middleInitial || !cellphoneNumber || !schoolEmail || signature === undefined || consent === undefined || submitted === undefined) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Update the drug test consent form using Entry (not DrugTestConsent)
    Entry.findByIdAndUpdate(consentId, {
        idNumber,
        lastName,
        firstName,
        middleInitial,
        cellphoneNumber,
        schoolEmail,
        signature,
        consent,
        submitted
    }, { new: true })
    .then(updatedConsentForm => {
        if (!updatedConsentForm) {
            return res.status(404).json({ success: false, message: 'Consent form not found' });
        }

        // Redirect to the list of drug test consent forms after successful update
        res.redirect('/drugTest/list'); // Redirect to the list of consent forms after update
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error updating consent form' });
    });
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
