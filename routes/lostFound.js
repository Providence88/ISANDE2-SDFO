const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const LOST_FOUND_ROUTE = 'lostAndFoundList';



// Get All Entries (with pagination)
router.get('/', async (req, res) => {
    try {
        // Pagination logic using sample data
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const entries = sampleEntries.slice(skip, skip + limit);
        const total = sampleEntries.length;

        res.render('lostFoundList', {
            entries,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).render('errorPage', { message: 'Error retrieving lost and found entries.' });
    }
});

// Get Entry for Editing
router.get('/edit/:id', async (req, res) => {
    try {
        const entry = sampleEntries.find((e) => e._id === req.params.id);
        if (!entry) {
            return res.status(404).render('errorPage', { message: 'Entry not found.' });
        }
        res.render('editLostFoundEntry', { entry });
    } catch (error) {
        res.status(500).render('errorPage', { message: 'Error retrieving the entry.' });
    }
});

// Create Entry
router.post(
    '/create',
    [
        body('itemId').notEmpty().withMessage('Item ID is required.'),
        body('itemName').notEmpty().withMessage('Item Name is required.'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('createLostFoundEntry', { errors: errors.array(), data: req.body });
        }
        try {
            const newEntry = { ...req.body, _id: `entry${Date.now()}` };
            sampleEntries.push(newEntry); // Adding to sample data for testing
            res.redirect(LOST_FOUND_ROUTE);
        } catch (error) {
            res.status(500).render('errorPage', { message: 'Error creating the entry.' });
        }
    }
);

// Edit Entry
router.post('/edit/:id', async (req, res) => {
    try {
        const entryIndex = sampleEntries.findIndex((e) => e._id === req.params.id);
        if (entryIndex === -1) {
            return res.status(404).render('errorPage', { message: 'Entry not found.' });
        }
        sampleEntries[entryIndex] = { ...sampleEntries[entryIndex], ...req.body };
        res.redirect(LOST_FOUND_ROUTE);
    } catch (error) {
        res.status(400).render('editLostFoundEntry', { entry: req.body, errors: [{ msg: 'Error updating the entry.' }] });
    }
});

// Delete Entry
router.post('/delete/:id', async (req, res) => {
    try {
        const entryIndex = sampleEntries.findIndex((e) => e._id === req.params.id);
        if (entryIndex === -1) {
            return res.status(404).render('errorPage', { message: 'Entry not found.' });
        }
        sampleEntries.splice(entryIndex, 1);
        res.redirect(LOST_FOUND_ROUTE);
    } catch (error) {
        res.status(500).render('errorPage', { message: 'Error deleting the entry.' });
    }
});

module.exports = router;
