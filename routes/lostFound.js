const express = require('express');
const { body, validationResult } = require('express-validator');
const LostFoundEntry = require('../models/LostFoundEntry'); // Import your LostFoundEntry model
const router = express.Router();

// Module links for the sidebar
const moduleLinks = [
    { name: "Home", icon: "home.png", link: "/main" },
    { name: "Non Fraternity Contract", icon: "fraternity.png", link: "/nonFraternity/list" },
    { name: "Drug Test Consent Form", icon: "drug-test.png", link: "/drugTest/list" },
    { name: "Lost and Found", icon: "lost-luggage.png", link: "/lostFound/list" },
    { name: "Disciplinary Cases", icon: "gavel.png", link: "/disciplinary/list" },
    { name: "Students", icon: "graduation.png", link: "/studentList" },
    { name: "Log Out", icon: "log-out.png", link: "/logout" },
];

// Route for listing all Lost and Found entries (with pagination)
router.get('/list', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const entries = await LostFoundEntry.find().skip(skip).limit(limit);
        const total = await LostFoundEntry.countDocuments();

        res.render('lostAndFoundList', {
            title: 'Lost and Found Entries',
            entries,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            moduleLinks
        });
    } catch (error) {
        res.status(500).render('errorPage', { message: 'Error retrieving lost and found entries.' });
    }
});

// Render the "Create Lost and Found Entry" page (GET)
router.get('/create', (req, res) => {
    res.render('createLostFoundEntry', {
        title: 'Create Lost and Found Entry',
        moduleLinks
    });
});

// Create Lost and Found Entry (POST)
router.post('/create', [
    body('itemId').notEmpty().withMessage('Item ID is required.'),
    body('itemName').notEmpty().withMessage('Item Name is required.'),
    body('location').notEmpty().withMessage('Location is required.'),
    body('description').notEmpty().withMessage('Description is required.'),
    body('dateLost').notEmpty().withMessage('Date Lost is required.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('createLostFoundEntry', { 
            title: 'Create Lost and Found Entry',
            errors: errors.array(),
            data: req.body,
            moduleLinks
        });
    }

    try {
        const newEntry = new LostFoundEntry(req.body);
        await newEntry.save();
        res.redirect('/lostFound/list');
    } catch (error) {
        res.status(500).render('errorPage', { message: 'Error creating the entry.' });
    }
});

// Render Edit Lost and Found Entry page (GET)
router.get('/edit/:id', async (req, res) => {
    try {
        const entry = await LostFoundEntry.findById(req.params.id);
        if (!entry) {
            return res.status(404).render('errorPage', { message: 'Entry not found' });
        }

        res.render('editLostFoundEntry', {
            title: 'Edit Lost and Found Entry',
            entry,
            moduleLinks
        });
    } catch (error) {
        res.status(500).render('errorPage', { message: 'Error retrieving the entry.' });
    }
});

// Edit Lost and Found Entry (POST)
router.post('/edit/:id', async (req, res) => {
    try {
        const entry = await LostFoundEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!entry) {
            return res.status(404).render('errorPage', { message: 'Entry not found' });
        }

        res.redirect('/lostFound/list');
    } catch (error) {
        res.status(500).render('editLostFoundEntry', {
            title: 'Edit Lost and Found Entry',
            entry: req.body,
            errors: [{ msg: 'Error updating the entry.' }],
            moduleLinks
        });
    }
});

// Delete Lost and Found Entry
router.post('/delete/:id', async (req, res) => {
    try {
        const entry = await LostFoundEntry.findByIdAndDelete(req.params.id);
        if (!entry) {
            return res.status(404).render('errorPage', { message: 'Entry not found' });
        }
        res.redirect('/lostFound/list');
    } catch (error) {
        res.status(500).render('errorPage', { message: 'Error deleting the entry.' });
    }
});

module.exports = router;
