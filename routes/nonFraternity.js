const express = require('express');
const { body, validationResult } = require('express-validator');
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

// Get All Non-Fraternity Contracts (with pagination)
router.get('/list', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Replace the following line with your actual data retrieval logic
        // Example: const contracts = await Contract.find().skip(skip).limit(limit);
        const contracts = []; // Replace this with actual data from your database
        const total = contracts.length;

        res.render('nonFraternityContractsList', {
            title: 'Non-Fraternity Contracts List',
            contracts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            moduleLinks
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('errorPage', { message: 'Error retrieving non-fraternity contracts.' });
    }
});

// Render the "Create Non-Fraternity Contract" page (GET)
router.get('/create', (req, res) => {
    res.render('createNonFraternityContract', {
        title: 'Create Non-Fraternity Contract',
        moduleLinks
    });
});

// Create Non-Fraternity Contract (POST)
router.post('/create', [
    body('name').notEmpty().withMessage('Name is required.'),
    body('college').notEmpty().withMessage('College is required.'),
    body('phone').notEmpty().withMessage('Phone number is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('createNonFraternityContract', {
            errors: errors.array(),
            data: req.body,
            title: 'Create Non-Fraternity Contract',
            moduleLinks
        });
    }

    try {
        const newContract = { ...req.body, id: `contract${Date.now()}` };
        // Save the contract to the database (e.g., Contract.create(newContract))
        res.redirect('/nonFraternity/list');
    } catch (error) {
        console.error(error);
        res.status(500).render('errorPage', { message: 'Error creating non-fraternity contract.' });
    }
});

// Render Edit Non-Fraternity Contract page (GET)
router.get('/edit/:id', (req, res) => {
    try {
        // Replace with logic to find contract from database (e.g., Contract.findById(req.params.id))
        const contract = null; // Replace with actual logic to retrieve contract
        if (!contract) {
            return res.status(404).render('errorPage', { message: 'Contract not found' });
        }
        res.render('editNonFraternityContract', {
            title: 'Edit Non-Fraternity Contract',
            contract,
            moduleLinks
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('errorPage', { message: 'Error retrieving contract for editing.' });
    }
});

// Edit Non-Fraternity Contract (POST)
router.post('/edit/:id', async (req, res) => {
    try {
        // Replace with logic to find and update contract from database (e.g., Contract.findByIdAndUpdate)
        const contract = null; // Replace with actual logic to retrieve contract
        if (!contract) {
            return res.status(404).render('errorPage', { message: 'Contract not found' });
        }

        // Update contract in database (e.g., Contract.findByIdAndUpdate(req.params.id, req.body))
        res.redirect('/nonFraternity/list');
    } catch (error) {
        console.error(error);
        res.status(500).render('errorPage', { message: 'Error updating contract.' });
    }
});

// Delete Non-Fraternity Contract
router.post('/delete/:id', async (req, res) => {
    try {
        // Replace with logic to delete contract from database (e.g., Contract.findByIdAndDelete)
        const contract = null; // Replace with actual logic to retrieve contract
        if (!contract) {
            return res.status(404).render('errorPage', { message: 'Contract not found' });
        }

        // Delete contract from database (e.g., Contract.findByIdAndDelete(req.params.id))
        res.redirect('/nonFraternity/list');
    } catch (error) {
        console.error(error);
        res.status(500).render('errorPage', { message: 'Error deleting contract.' });
    }
});

module.exports = router;
