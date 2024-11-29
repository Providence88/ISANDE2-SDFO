const express = require('express');
const session = require('express-session');
//const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const hbs = require('hbs');
const Entry = require('./models/Entry');  // Ensure the correct model path
const LostFoundEntry = require('./models/LostFoundEntry');
const DisciplinaryCase = require('./models/DisciplinaryCase');
const Handlebars = require('handlebars');
const router = express.Router();

// Initialize app and middleware
const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.json()); // json is better for mongodb 
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'mySecret', resave: false, saveUninitialized: true }));

// MongoDB connection
mongoose.connect('mongodb://localhost/student-discipline', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));


    hbs.registerHelper('ifCond', function(v1, operator, v2, options) {
      if (options === undefined) {
          options = v2;
          v2 = operator;
          operator = '==';
      }
  
      switch (operator) {
          case '==':
              return (v1 == v2) ? options.fn(this) : options.inverse(this);
          case '===':
              return (v1 === v2) ? options.fn(this) : options.inverse(this);
          case '!=':
              return (v1 != v2) ? options.fn(this) : options.inverse(this);
          case '!==':
              return (v1 !== v2) ? options.fn(this) : options.inverse(this);
          case '><':
              return (v1 > v2) ? options.fn(this) : options.inverse(this);
          case '<>':
              return (v1 < v2) ? options.fn(this) : options.inverse(this);
          default:
              return options.inverse(this);
      }
  });
  
hbs.registerHelper('eq', function(v1, v2) {
    return v1 == v2;
});

hbs.registerHelper('ifCond', function(v1, v2, options) {
  if (v1 == v2) {
      return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('eq', function (a, b) {
  return a === b;
});

    const modules = [
      {
        "image": "discipline.jpg",
        "title": "Disciplinary Cases",
        "actions": [
          { "label": "New", "link": "/createDisciplinaryCase" },
          { "label": "Edit", "link": "/editDisciplinaryCase" },
          { "label": "See List", "link": "/disciplinaryCasesList" }
        ]
      },
      {
        "image": "drugtest.jpg",
        "title": "Drug Test Consent",
        "actions": [
          { "label": "New", "link": "/createDrugTestConsent" },
          { "label": "Edit", "link": "/editDrugTestConsent" },
          { "label": "See List", "link": "/drugTestConsentsList" }
        ]
      },
      {
        "image": "landf.jpg",
        "title": "Lost and Found",
        "actions": [
          { "label": "New", "link": "/createLostFoundEntry" },
          { "label": "Edit", "link": "/editLostFoundEntry" },
          { "label": "See List", "link": "/lostAndFoundList" }
        ]
      },
      {
        "image": "frat.jpg",
        "title": "Non-Fraternity Contracts",
        "actions": [
          { "label": "New", "link": "/createNonFraternityContract" },
          { "label": "Edit", "link": "/editNonFraternityContract" },
          { "label": "See List", "link": "/nonFraternityContractsList" }
        ]
      }
    ];


    const moduleLinks = [
      { name: "Home", icon: "home.png", link: "/main" },
      { name: "Non Fraternity Contract", icon: "fraternity.png", link: "/nonFraternityContractsList" },
      { name: "Drug Test Consent Form", icon: "drug-test.png", link: "/drugTestConsentsList" },
      { name: "Lost and Found", icon: "lost-luggage.png", link: "/lostAndFoundList" },
      { name: "Disciplinary Cases", icon: "gavel.png", link: "/disciplinaryCasesList" },
      { name: "Log Out", icon: "log-out.png", link: "/logout" },
    ];
    


  const colleges = ["BAGCED", "CCS", "CLA", "COB", "COS", "GCOE"];
  const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
  const escalationLevels = [
    'Investigation',
    'Further Assessment',
    'Evaluation',
    'Hearing',
    'Mediation',
    'On-Going',
    'Solved'
    ];


// Sample data for testing
const sampleEntries = [
  {
      itemId: '1',
      itemName: 'Wallet',
      locationFound: 'Main Lobby',
      dateTimeFound: '2024-11-20 10:30 AM',
      confirmedBy: 'John Doe',
      claimed: true,
      claimedBy: 'Jane Smith',
      claimedConfirmedBy: 'John Doe',
      dateClaimed: '2024-11-21',
      _id: 'entry1_id', // Unique ID for testing
  },
  {
      itemId: '2',
      itemName: 'Backpack',
      locationFound: 'North Entrance',
      dateTimeFound: '2024-11-22 2:00 PM',
      confirmedBy: 'Jane Smith',
      claimed: false,
      claimedBy: '',
      claimedConfirmedBy: '',
      dateClaimed: '',
      _id: 'entry2_id', // Unique ID for testing
  },
];

const fratSamples = [
  {
      id: "123456",
      name: "John Doe",
      college: "BAGCED",
      phone: "09123456789",
      email: "johndoe@example.com",
      consent1: "Yes",
      consent2: "Yes"
  },
  {
      id: "789012",
      name: "Jane Smith",
      college: "CCS",
      phone: "09234567890",
      email: "janesmith@example.com",
      consent1: "No",
      consent2: "No"
  }
];

const drugSample = [
  {
      idNumber: "123456",
      fullName: "John Doe",
      cellphoneNumber: "09123456789",
      schoolEmail: "johndoe@example.com",
      signature: "Yes",
      consent: "Yes",
      submitted: "Yes"
  },
  {
      idNumber: "789012",
      fullName: "Jane Smith",
      cellphoneNumber: "09234567890",
      schoolEmail: "janesmith@example.com",
      signature: "No",
      consent: "Yes",
      submitted: "No"
  }
];

const discSample = [
  {
      complainantId: '12345',
      complainantName: 'John Doe',
      complainantEmail: 'johndoe@example.com',
      respondentId: '67890',
      respondentName: 'Jane Smith',
      respondentEmail: 'janesmith@example.com',
      currentLevelOfEscalation: 'Investigation',
      confirmedBy: 'Admin',
      _id: 1
  },
  {
      complainantId: '23456',
      complainantName: 'Mark Lee',
      complainantEmail: 'marklee@example.com',
      respondentId: '34567',
      respondentName: 'Alice Johnson',
      respondentEmail: 'alicejohnson@example.com',
      currentLevelOfEscalation: 'Further Assessment',
      confirmedBy: 'Admin',
      _id: 2
  }
];





// Root route to redirect to main page
app.get('/', (req, res) => {
  res.render('signin', {
    layout: 'signin',
    title: 'Register | Sign Up',
    css: 'signup.css'
  });
});

app.get('/login', (req, res) => {
  res.render('login', { 
    error: null,
    layout: 'login',
    title: 'Log Into Existing Account',
    css: 'signup.css'
    }); // Render the login.hbs view
});

// Routes
app.get('/main', (req, res) => {
  if (!req.session.user) {
      return res.redirect('/login'); // Redirect to login if not authenticated
  }
  res.render('main', { 
    title: 'Main Dashboard',
      modules,
      moduleLinks,
      colleges: colleges, 
      alphabet: alphabet });
});


app.get('/createNonFraternityContract', (req, res) => {
  res.render('createNonFraternityContract', { 
      title: 'Create Non Fraternity Contract',
      modules,
      moduleLinks,
      colleges: colleges, 
      alphabet: alphabet 
  });
});

app.get('/editNonFraternityContract', (req, res) => {
  res.render('editNonFraternityContract', { 
      title: 'Edit Non Fraternity Contract',
      contracts: fratSamples,
      modules,
      moduleLinks,
      colleges: colleges, 
      alphabet: alphabet
  });
});

app.get('/nonFraternityContractsList', (req, res) => {
  try {
      res.render('nonFraternityContractsList', { 
          title: 'Non Fraternity Contracts', 
          contracts: fratSamples,
          modules,
          moduleLinks,
          colleges: colleges, 
          alphabet: alphabet});
  } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving contracts');
  }
});


app.get('/createLostFoundEntry', (req, res) => {
  res.render('createLostFoundEntry', { 
      title: 'Create Lost and Found Entry',
      modules,
      moduleLinks
  });
});

app.get('/editLostFoundEntry', (req, res) => {
  res.render('editLostFoundEntry', { 
      title: 'Edit Lost and Found Entry',
      Entry,
      modules,
      moduleLinks,
      entries: sampleEntries 
  });
});

app.get('/lostAndFoundList', (req, res) => {
  try {
    const entry = sampleEntries.find(e => e._id === req.params.id);
    res.render('lostAndFoundList', { 
      title: 'Lost and Found List',
      entry,
      modules,
      moduleLinks,
      entries: sampleEntries 
    });
  } catch (error) {
    res.status(500).render('errorPage', { message: 'Error retrieving lost and found entries.' });
  }
});



app.get('/createDrugTestConsent', (req, res) => {
  res.render('createDrugTestConsent', { 
      title: 'Create Drug Test Consent Form',
      modules,
      moduleLinks,
      alphabet: alphabet
  });
});

app.get('/editDrugTestConsent', (req, res) => {
  res.render('editDrugTestConsent', {
      title: 'Edit Drug Test Consent Form',
      modules,
      moduleLinks,
      Entry,
      alphabet,
    });
  });

  app.get('/drugTestConsentsList', (req, res) => {
    try {
      res.render('drugTestConsentsList', {
        title: 'Drug Test Consents List',
        entries: drugSample,
        modules,
        moduleLinks,
        alphabet,
      });
    } catch (error) {
      res.status(500).render('errorPage', { message: 'Error retrieving drug test consent entries.' });
    }
});

app.get('/createDisciplinaryCase', (req, res) => {
  res.render('createDisciplinaryCase', { 
      title: 'Create Disciplinary Case',
      modules,
      moduleLinks,
      escalationLevels
  });
});
  
app.get('/editDisciplinaryCase', (req, res) => {
  res.render('editDisciplinaryCase', { 
      title: 'Edit Disciplinary Case ',
      entries: discSample,
      modules,
      moduleLinks,
     escalationLevels
  });
});

app.get('/disciplinaryCasesList', (req, res) => {
  try {
    res.render('disciplinaryCasesList', {
      title: 'Disciplinary Cases List',
      entries: discSample,
      modules,
      moduleLinks,
      escalationLevels
    });
  } catch (error) {
    res.status(500).render('errorPage', { message: 'Error retrieving disciplinary case entries.' });
  }
});

app.get('/profile', (req, res) => {
  res.render('profile', {
      title: 'Edit Non Fraternity Contract',
      contracts: fratSamples,
      modules,
      moduleLinks,
      colleges: colleges, 
      alphabet: alphabet
  });
});


// Routes
const loginRoute = require('./routes/login');
const mainRoute = require('./routes/main');

// Add specific module routes
const nonFraternityContractRoute = require('./routes/nonFraternity');  
const drugTestConsentRoute = require('./routes/drugTest');  
const lostFoundRoute = require('./routes/lostFound');  
const disciplinaryCaseRoute = require('./routes/disciplinary');

const editNonFraternityContractRoute = require('./routes/nonFraternity');  
const editDrugTestConsentRoute = require('./routes/drugTest');  
const editLostFoundRoute = require('./routes/lostFound');  
const editDisciplinaryCaseRoute = require('./routes/disciplinary');



// Route handling
app.use('/', loginRoute);
app.use('/main', mainRoute); // Ensure main route is mounted
app.use('/createNonFraternityContract', nonFraternityContractRoute);  
app.use('/createDrugTestConsent', drugTestConsentRoute);  
app.use('/createLostFoundEntry', lostFoundRoute);  
app.use('/createDisciplinaryCase', disciplinaryCaseRoute);  



app.use('/editNonFraternityContract', editNonFraternityContractRoute);  
app.use('/editDrugTestConsent', editDrugTestConsentRoute);  
app.use('/editLostFoundEntry', editLostFoundRoute);  
app.use('/editDisciplinaryCase', editDisciplinaryCaseRoute);

//

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Listening at port ${PORT}`);
});