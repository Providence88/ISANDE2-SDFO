const express = require('express');
const { body, validationResult } = require('express-validator');
const LostFoundEntry = require('../models/LostFoundEntry'); // Import your LostFoundEntry model
const router = express.Router();

// Module links for the sidebar
const moduleLinks = [
    { name: "Home", icon: "home.png", link: "/main" },
    { name: "Non Fraternity Contract", icon: "fraternity.png", link: "/dtcfNFC/list" },
    { name: "Drug Test Consent Form", icon: "drug-test.png", link: "/dtcfNFC/list" },
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


router.post('/create', async (req, res) => {
    const { itemId, itemName, locationFound, dateTimeFound, confirmedBy, claimed, claimedBy, claimConfirmedBy, dateClaimed } = req.body;

    try {
        // Convert dateTimeFound and dateClaimed strings to Date objects if provided
        const parsedDateTimeFound = dateTimeFound ? new Date(dateTimeFound) : null;
        const parsedDateClaimed = dateClaimed ? new Date(dateClaimed) : null;

        // Create a new Lost and Found entry
        const newEntry = new LostFoundEntry({
            itemId,
            itemName,
            locationFound,
            dateTimeFound: parsedDateTimeFound,
            confirmedBy,
            claimed: claimed === 'true', // Convert string to boolean
            claimedBy: claimed ? claimedBy : null, // Only set claimedBy if claimed is true
            claimConfirmedBy: claimed ? claimConfirmedBy : null, // Only set claimConfirmedBy if claimed is true
            dateClaimed: claimed ? parsedDateClaimed : null // Only set dateClaimed if claimed is true
        });

        // Save the entry to the database
        await newEntry.save();

        // Redirect to the list page after successful creation
        res.redirect('/lostFound/list');
    } catch (error) {
        console.error('Error creating Lost and Found entry:', error);
        res.status(500).render('errorPage', { message: 'Error creating Lost and Found entry.' });
    }
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


// Handle the "Edit Lost and Found Entry" form submission (POST)
router.post('/edit/:id', async (req, res) => {
    const entryId = req.params.id;
    const { itemId, itemName, locationFound, dateTimeFound, confirmedBy, claimed, claimedBy, claimConfirmedBy, dateClaimed } = req.body;

    try {
        // Convert dateTimeFound and dateClaimed strings to Date objects if provided
        const parsedDateTimeFound = dateTimeFound ? new Date(dateTimeFound) : null;
        const parsedDateClaimed = dateClaimed ? new Date(dateClaimed) : null;

        // Find the existing entry by ID
        const entry = await LostFoundEntry.findById(entryId);

        if (!entry) {
            return res.status(404).send('Lost and Found entry not found');
        }

        // Update the entry's fields
        entry.itemId = itemId;
        entry.itemName = itemName;
        entry.locationFound = locationFound;
        entry.dateTimeFound = parsedDateTimeFound;
        entry.confirmedBy = confirmedBy;
        entry.claimed = claimed === 'true'; // Convert string to boolean
        entry.claimedBy = claimed ? claimedBy : null; // Only set claimedBy if claimed is true
        entry.claimConfirmedBy = claimed ? claimConfirmedBy : null; // Only set claimConfirmedBy if claimed is true
        entry.dateClaimed = claimed ? parsedDateClaimed : null; // Only set dateClaimed if claimed is true

        // Save the updated entry
        await entry.save();

        // Redirect to the list page after successful update
        res.redirect('/lostFound/list');
    } catch (error) {
        console.error('Error updating Lost and Found entry:', error);
        res.status(500).render('errorPage', { message: 'Error updating Lost and Found entry.' });
    }
});



module.exports = router;
