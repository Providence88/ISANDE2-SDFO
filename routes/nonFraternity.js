const express = require('express');
const router = express.Router();


// Create Entry for Non-Fraternity Contract
router.post('/create', async (req, res) => {
    try {
        // Normally, save to database here, but for sample, you can ignore it
        // const entry = new Entry(req.body);
        // await entry.save();
        res.redirect('/main'); // Redirect to the main page or a specific page for non-fraternity contracts
    } catch (error) {
        res.status(400).send(error);
    }
});

// Edit Entry for Non-Fraternity Contract
router.post('/edit/:id', async (req, res) => {
    try {
        const entry = fratSamples.find(f => f.id === req.params.id); // Find by id
        if (!entry) {
            return res.status(404).send('Entry not found');
        }
        // Update logic here if needed
        res.redirect('/main'); // Redirect after successful update
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get Entry for Editing Non-Fraternity Contract
router.get('/edit/:id', async (req, res) => {
    try {
        const entry = fratSamples.find(f => f.id === req.params.id); // Find by id
        if (!entry) {
            return res.status(404).send('Entry not found');
        }
        res.render('editNonFraternityContract', { entry }); // Pass entry data to Handlebars template
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get All Non-Fraternity Contracts (using the sample data)
router.get('/', (req, res) => {
    try {
        res.render('nonFraternityContracts', { contracts: fratSamples });
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
