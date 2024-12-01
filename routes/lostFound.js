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

router.get('/list', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Get filter value from query parameters
        const claimedFilter = req.query.claimed;
        let filter = {};

        if (claimedFilter === 'true') {
            filter.claimed = true;
        } else if (claimedFilter === 'false') {
            filter.claimed = false;
        }

        const entries = await LostFoundEntry.find(filter).skip(skip).limit(limit);
        const total = await LostFoundEntry.countDocuments(filter);

        res.render('lostAndFoundList', {
            title: 'Lost and Found Entries',
            entries,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            filter: req.query,
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

router.post('/edit/:id', (req, res) => {
    const { itemId, itemName, locationFound, dateTimeFound, confirmedBy, claimed, claimedBy, claimConfirmedBy, dateClaimed } = req.body;
    const entryId = req.params.id;

    // Convert dateTimeFound string to a Date object
    const parsedDateTimeFound = new Date(dateTimeFound); // Converts string to Date object

    // Validate input fields
    if (!itemId || !itemName || !locationFound || !dateTimeFound || !confirmedBy || claimed === undefined || !claimedBy || !claimConfirmedBy || !dateClaimed) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Update the Lost and Found entry
    LostFoundEntry.findByIdAndUpdate(entryId, {
        itemId,
        itemName,
        locationFound,
        dateTimeFound: parsedDateTimeFound, // Store the Date object
        confirmedBy,
        claimed,
        claimedBy,
        claimConfirmedBy,
        dateClaimed
    }, { new: true })
    .then(updatedEntry => {
        if (!updatedEntry) {
            return res.status(404).json({ success: false, message: 'Lost and Found entry not found' });
        }

        // After update, render the list with the updated entry
        res.redirect('/lostFound/list');  // This should refresh the list of entries
    })
    .catch(err => {
        console.error('Error updating Lost and Found entry:', err);
        res.status(500).json({ success: false, message: 'Error updating Lost and Found entry' });
    });
});

router.get('/edit/:id', (req, res) => {
    const entryId = req.params.id;

    LostFoundEntry.findById(entryId)
        .then(entry => {
            if (!entry) {
                return res.status(404).send('Lost and Found entry not found');
            }

            // Log the entry data to check if claimedConfirmedBy is present
            console.log(entry); // Check if claimedConfirmedBy exists in the logged entry

            // Format the dateTimeFound to match the input's expected format (YYYY-MM-DDTHH:MM)
            const formattedDate = entry.dateTimeFound ? entry.dateTimeFound.toISOString().slice(0, 16) : '';

            res.render('editLostFoundEntry', {
                entry: { ...entry.toObject(), dateTimeFound: formattedDate },
                moduleLinks
            });
        })
        .catch(err => {
            console.error('Error fetching entry:', err);
            res.status(500).send('Error retrieving Lost and Found entry');
        });
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
