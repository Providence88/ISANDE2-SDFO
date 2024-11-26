const express = require('express');
const router = express.Router();

// Main page
router.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('main');
});

module.exports = router;
