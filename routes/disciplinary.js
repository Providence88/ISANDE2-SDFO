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

// Render Edit Disciplinary Case page (GET)
router.get('/edit/:id', async (req, res) => {
    try {
        const caseId = req.params.id;
        const disciplinaryCase = await DisciplinaryCase.findById(caseId);

        if (!disciplinaryCase) {
            return res.status(404).render('errorPage', { message: 'Disciplinary case not found' });
        }

        res.render('editDisciplinaryCase', {
            title: 'Edit Disciplinary Case',
            moduleLinks,
            escalationLevels,
            caseId: disciplinaryCase._id,
            complainantId: disciplinaryCase.complainantId,
            complainantName: disciplinaryCase.complainantName,
            complainantEmail: disciplinaryCase.complainantEmail,
            respondentId: disciplinaryCase.respondentId,
            respondentName: disciplinaryCase.respondentName,
            respondentEmail: disciplinaryCase.respondentEmail,
            currentLevelOfEscalation: disciplinaryCase.currentLevelOfEscalation,
            confirmedBy: disciplinaryCase.confirmedBy,
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('errorPage', { message: 'Error retrieving disciplinary case data' });
    }
});

// Edit Disciplinary Case (PUT)
router.put('/edit/:id', async (req, res) => {
    try {
        console.log('Received data:', req.body); // Log the incoming data to check if it's coming through

        const updatedCase = await DisciplinaryCase.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedCase) {
            return res.status(404).json({ error: 'Case not found or not updated' });
        }

        console.log('Updated case:', updatedCase); // Log the updated case data

        // Redirect to the updated case's detail page or back to the list
        res.status(200).redirect(`/disciplinary/list`);
    } catch (error) {
        console.error('Error updating case:', error);
        res.status(400).json({ error: 'Error updating the case' });
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