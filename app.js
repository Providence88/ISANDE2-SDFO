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

// Root route to redirect to main page
app.get('/', (req, res) => {
    res.redirect('/main'); // Redirect to the main page
});

// Routes
const loginRoute = require('./routes/login');
const mainRoute = require('./routes/main');
const moduleRoute = require('./routes/module');

// Add specific module routes
const nonFraternityContractRoute = require('./routes/nonFraternity');  
const drugTestConsentRoute = require('./routes/drugTest');  
const lostAndFoundRoute = require('./routes/lostFound');  
const disciplinaryCasesRoute = require('./routes/disciplinary');

// Route handling
app.use('/', loginRoute);
app.use('/main', mainRoute); // Ensure main route is mounted
app.use('/module/non-fraternity-contracts', nonFraternityContractRoute);  
app.use('/module/drug-test-consents', drugTestConsentRoute);  
app.use('/module/lost-and-found', lostAndFoundRoute);  
app.use('/module/disciplinary-cases', disciplinaryCasesRoute);  

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Listening at port ${PORT}`);
});