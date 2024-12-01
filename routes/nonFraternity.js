const express = require('express');
const { body, validationResult } = require('express-validator');
const NonFratContract = require('../models/NonFratContract'); // Correct casing
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

const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];



router.get('/list', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const contracts = await NonFratContract.find().skip(skip).limit(limit);
        const total = await NonFratContract.countDocuments();

        console.log(contracts); // Debug output to check if contracts are correctly fetched
        res.render('nonFraternityContractsList', {
            title: 'Non-Fraternity Contracts List',
            contracts,
            alphabet,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            moduleLinks
        });
    } catch (error) {
        res.status(500).render('errorPage', { message: 'Error retrieving non-fraternity contracts.' });
    }
});

// Render the "Create Non-Fraternity Contract" page (GET)
router.get('/create', (req, res) => {
    res.render('createNonFraternityContract', {
        title: 'Create Non-Fraternity Contract',
        moduleLinks,
        alphabet
    });
});

router.post('/create', [
    body('idNumber').notEmpty().withMessage('ID Number is required.'),
    body('lastName').notEmpty().withMessage('Last Name is required.'),
    body('firstName').notEmpty().withMessage('First Name is required.'),
    body('middleInitial').notEmpty().withMessage('Middle Initial is required.'),
    body('cellphoneNumber').notEmpty().withMessage('Phone number is required.'),
    body('schoolEmail').isEmail().withMessage('Valid email is required.'),
    body('signature').notEmpty().withMessage('Signature is required.'),
    body('submitted').notEmpty().withMessage('Submission status is required.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return errors as JSON
    }

    try {
        const newContract = new NonFratContract(req.body); // Create new contract from the form data
        await newContract.save(); // Save the contract to the database

        res.redirect('/nonFraternity/list');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating non-fraternity contract.' });
    }
});

// Edit Non-Fraternity Contract
router.get('/edit/:id', async (req, res) => {
    const contractId = req.params.id;

    try {
        const contract = await NonFratContract.findById(contractId);
        if (!contract) {
            return res.status(404).send('Non-Fraternity contract not found');
        }

        res.render('editNonFraternityContract', {
            contract: { ...contract.toObject(), id: contract._id },
            moduleLinks,
            alphabet
        });
    } catch (err) {
        console.error('Error fetching contract:', err);
        res.status(500).send('Error retrieving contract');
    }
});

router.post('/edit/:id', async (req, res) => {
    const { idNumber, lastName, firstName, middleInitial, cellphoneNumber, schoolEmail, signature, submitted } = req.body;
    const contractId = req.params.id;

    // Validate required fields
    if (!idNumber || !lastName || !firstName || !cellphoneNumber || !schoolEmail) {
        return res.status(400).send('Missing required fields');
    }

    try {
        const updatedContract = await NonFratContract.findByIdAndUpdate(
            contractId,
            {
                idNumber: idNumber.trim(),
                lastName: lastName.trim(),
                firstName: firstName.trim(),
                middleInitial: middleInitial.trim(),
                cellphoneNumber: cellphoneNumber.trim(),
                schoolEmail: schoolEmail.trim(),
                signature: signature === 'true', // Convert to boolean
                submitted: submitted === 'true'  // Convert to boolean
            },
            { new: true, runValidators: true }
        );

        if (!updatedContract) {
            return res.status(404).send('Contract not found');
        }

        res.redirect('/nonFraternity/list');  // Redirect back to the list page
    } catch (err) {
        console.error('Error updating contract:', err);
        res.status(500).send('Error updating contract');
    }
});

// Delete Non-Fraternity Contract
router.post('/delete/:id', async (req, res) => {
    try {
        const contract = await NonFratContract.findByIdAndDelete(req.params.id);
        if (!contract) {
            return res.status(404).render('errorPage', { message: 'Contract not found' });
        }

        res.redirect('/nonFraternity/list');
    } catch (error) {
        console.error(error);
        res.status(500).render('errorPage', { message: 'Error deleting contract.' });
    }
});

module.exports = router;
