const express = require('express');
const router = express.Router();

// Hardcoded test user
const testUser  = {
    email: 'testuser@gmail.com',
    password: 'password123' // Change these values to whatever you'd like for testing
};

// Login page
router.get('/login', (req, res) => {
    res.render('login', { error: null }); // Ensure error is set to null initially
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check credentials against the hardcoded test user
    if (email === testUser.email && password === testUser .password) {
        req.session.user = testUser ; // Store the test user in the session
        res.redirect('/main'); // Redirect to main page on success
    } else {
        // Render the login page with an error message if credentials are invalid
        res.render('login', { error: 'Invalid credentials' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;