const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const hbs = require('hbs');

// Initialize app and middleware
const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'mySecret', resave: false, saveUninitialized: true }));

// MongoDB connection
mongoose.connect('mongodb://localhost/student-discipline', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Root route to redirect to login page
app.get('/', (req, res) => {
    res.redirect('/login'); // Redirect to the login page
});

// Routes
const loginRoute = require('./routes/login');
const mainRoute = require('./routes/main');
const moduleRoute = require('./routes/module');

// Add specific module routes
const nonFraternityContractRoute = require('./routes/nonFraternityContract');  
const drugTestConsentRoute = require('./routes/drugTestConsent');  
const lostAndFoundRoute = require('./routes/lostAndFound');  
const disciplinaryCasesRoute = require('./routes/disciplinaryCases');  

// Route handling
app.use('/', loginRoute);
app.use('/', mainRoute);
app.use('/module/non-fraternity-contracts', nonFraternityContractRoute);  
app.use('/module/drug-test-consents', drugTestConsentRoute);  
app.use('/module/lost-and-found', lostAndFoundRoute);  
app.use('/module/disciplinary-cases', disciplinaryCasesRoute);  

// Start server
app.listen(3000, () => console.log('Server running on port 3000'));
