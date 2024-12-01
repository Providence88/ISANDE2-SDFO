const express = require('express');
const DisciplinaryCase = require('../models/DisciplinaryCase');
const router = express.Router();

// Render the "Create Disciplinary Case" page (GET)
router.get('/create', (req, res) => {
    res.render('createDisciplinaryCase', {
        title: 'Create Disciplinary Case',
        modules: req.app.locals.modules,  // Assuming `modules` is stored in app.locals
        moduleLinks: req.app.locals.moduleLinks,
        escalationLevels: [ // Use a colon here instead of an equals sign
            'Investigation',
            'Further Assessment',
            'Evaluation',
            'Hearing',
            'Mediation',
            'On-Going',
            'Solved'
        ]
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




// Edit Case
router.put('/editDisciplinaryCase/:id', async (req, res) => {
    try {
        const updatedCase = await DisciplinaryCase.findByIdAndUpdate(req.params.id, req.body);

        if (updatedCase){
            res.redirect('/editDisciplinaryCase');
        } else {
            res.status(404).json({ error: 'Case not edited.' });
        }
    } catch (error) {
        res.status(400).send(error);
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
            modules: req.app.locals.modules,
            moduleLinks: req.app.locals.moduleLinks,
            escalationLevels: req.app.locals.escalationLevels
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('errorPage', { message: 'Error retrieving disciplinary cases.' });
    }
});

module.exports = router;