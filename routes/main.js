const express = require('express');
const router = express.Router();

// Main page
router.get('/main', (req, res) => {
    // Check if the user is authenticated
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    res.render('main', { 
        user: req.session.user,
        css: '/public/style.css' 
    }); 
});

module.exports = router;