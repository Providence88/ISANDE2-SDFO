const express = require('express');
const DisciplinaryCase = require('../models/DisciplinaryCase');
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

const colleges = ["BAGCED", "CCS", "CLA", "COB", "COS", "GCOE"];
const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const escalationLevels = [
    'Investigation',
    'Further Assessment',
    'Evaluation',
    'Hearing',
    'Mediation',
    'On-Going',
    'Solved'
];

// Render the "Create Disciplinary Case" page (GET)
router.get('/create', (req, res) => {
    res.render('createDisciplinaryCase', {
        title: 'Create Disciplinary Case',
        moduleLinks,
        escalationLevels,
    });
});

// Create Disciplinary Case (POST)
router.post('/create', async (req, res) => {
    try {
        const newCase = new DisciplinaryCase(req.body);
        await newCase.save();
        res.redirect('/disciplinary/list'); // Redirect to the cases list after successful creation
    } catch (error) {
        console.error(error);
        res.status(500).render('errorPage', { message: 'Error creating disciplinary case.' });
    }
});

// Route to render the Edit Disciplinary Case page
router.get('/edit/:id', (req, res) => {
    const caseId = req.params.id;

    // Find the disciplinary case by ID using promise-based syntax
    DisciplinaryCase.findById(caseId)
        .then(disciplinaryCase => {
            if (!disciplinaryCase) {
                return res.status(404).send('Case not found');
            }

            // Render the Edit Disciplinary Case page with the case data and escalation levels
            res.render('editDisciplinaryCase', {
                moduleLinks,
                caseId: caseId, // Pass caseId to the template
                complainantId: disciplinaryCase.complainantId,
                complainantName: disciplinaryCase.complainantName,
                complainantEmail: disciplinaryCase.complainantEmail,
                respondentId: disciplinaryCase.respondentId,
                respondentName: disciplinaryCase.respondentName,
                respondentEmail: disciplinaryCase.respondentEmail,
                currentLevelOfEscalation: disciplinaryCase.currentLevelOfEscalation,
                confirmedBy: disciplinaryCase.confirmedBy,
                escalationLevels: escalationLevels // Passing the predefined escalation levels
            });
        })
        .catch(err => {
            console.error('Error fetching case:', err);
            res.status(500).send('Error retrieving case');
        });
});

// Route to handle updating the disciplinary case
router.post('/update/:id', (req, res) => {
    const { complainantId, complainantName, complainantEmail, respondentId, respondentName, respondentEmail, currentLevelOfEscalation, confirmedBy } = req.body;
    const caseId = req.params.id;

    // Validate the input
    if (!complainantId || !complainantName || !complainantEmail || !respondentId || !respondentName || !respondentEmail || !currentLevelOfEscalation || !confirmedBy) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Update the disciplinary case
    DisciplinaryCase.findByIdAndUpdate(caseId, {
        complainantId,
        complainantName,
        complainantEmail,
        respondentId,
        respondentName,
        respondentEmail,
        currentLevelOfEscalation, // Using the updated escalation level from the form
        confirmedBy
    }, { new: true })
    .then(updatedCase => {
        if (!updatedCase) {
            return res.status(404).json({ success: false, message: 'Case not found' });
        }

        // Redirect to the list of disciplinary cases after successful update
        res.redirect('/disciplinary/list');
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error updating case' });
    });
});

// Delete Case
router.post('/delete/:id', async (req, res) => {
    try {
        await DisciplinaryCase.findByIdAndDelete(req.params.id);
        res.redirect('/disciplinary/list');
    } catch (error) {
        res.status(400).send(error);
    }
});

// List Disciplinary Cases
router.get('/list', async (req, res) => {
    try {
        const cases = await DisciplinaryCase.find();
        res.render('disciplinaryCasesList', {
            title: 'Disciplinary Cases List',
            entries: cases,
            moduleLinks,
            escalationLevels
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('errorPage', { message: 'Error retrieving disciplinary cases.' });
    }
});

module.exports = router;
