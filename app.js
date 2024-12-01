const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
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
          { "label": "New", "link": "/disciplinary/create" },
          { "label": "Edit", "link": "/disciplinary/list" },
          { "label": "See List", "link": "/disciplinary/list" }
        ]
      },
      {
        "image": "drugtest.jpg",
        "title": "Drug Test Consent",
        "actions": [
          { "label": "New", "link": "/drugTest/create" },
          { "label": "Edit", "link": "/drugTest/list" },
          { "label": "See List", "link": "/drugTest/list" }
        ]
      },
      {
        "image": "landf.jpg",
        "title": "Lost and Found",
        "actions": [
          { "label": "New", "link": "/lostFound/create" },
          { "label": "Edit", "link": "/lostFound/list" },
          { "label": "See List", "link": "/lostFound/list" }
        ]
      },
      {
        "image": "frat.jpg",
        "title": "Non-Fraternity Contracts",
        "actions": [
          { "label": "New", "link": "/nonFraternity/create" },
          { "label": "Edit", "link": "/nonFraternity/list" },
          { "label": "See List", "link": "/nonFraternity/list" }
        ]
      }
    ];

  const moduleLinks = [
      { name: "Home", icon: "home.png", link: "/main" },
      { name: "Non Fraternity Contract", icon: "fraternity.png", link: "/nonFraternity/list" },
      { name: "Drug Test Consent Form", icon: "drug-test.png", link: "/drugTest/list" },
      { name: "Lost and Found", icon: "lost-luggage.png", link: "/lostFound/list" },
      { name: "Disciplinary Cases", icon: "gavel.png", link: "/disciplinary/list" },
      { name: "Students", icon: "graduation.png", link: "/studentList" },
      { name: "Log Out", icon: "log-out.png", link: "/logout" },
    ];
  const colleges = ["BAGCED", "CCS", "CLA", "COB", "COS", "GCOE"];
  const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];


const studentSample = [
  {
      studentId: '12019631',
      name: 'Timothy Jacob Rivera',
      email: 'timothy_jacob_rivera@dlsu.edu.ph',
      colleges: 'CCS',
      _id: 1
  },
  {
      studentId: '12345678',
      name: 'John Doe',
      email: 'johndoe@example.com',
      colleges: 'COB',
      _id: 2
  }
];


// Root route to redirect to main page
app.get('/', (req, res) => {
  res.render('login', {
    layout: 'login',
    title: 'Log Into Existing Account',
    css: 'signup.css'
  });
});

app.get('/signin', (req, res) => {
  res.render('signin', { 
    error: null,
    layout: 'signin',
    title: 'Contact ITS',
    css: 'signup.css'
    }); // Render the login.hbs view
});

app.get('/login', (req, res) => {
  res.render('login', {
    layout: 'login',
    title: 'Log Into Existing Account',
    css: 'signup.css'
  });
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

app.get('/profile', (req, res) => {
  res.render('profile', {
      title: 'Edit Non Fraternity Contract',
      modules,
      moduleLinks,
      colleges: colleges, 
      alphabet: alphabet
  });
});

app.get('/studentlist', (req, res) => {
  res.render('studentlist', {
      title: 'Students',
      students: studentSample,
      modules,
      moduleLinks: moduleLinks,
      colleges: colleges, 
  });
});


// Routes
const loginRoute = require('./routes/login');
const mainRoute = require('./routes/main');

// Add specific module routes
const nonFraternityContractRoute = require('./routes/nonFraternity');  
const disciplinaryCaseRoute = require('./routes/disciplinary');
const drugTestConsentRoute = require('./routes/drugTest');
const lostFoundRoute = require('./routes/lostFound');


// Route handling
app.use('/', loginRoute);
app.use('/main', mainRoute); // Ensure main route is mounted


app.use('/disciplinary', disciplinaryCaseRoute);
app.use('/drugTest', drugTestConsentRoute);
app.use('/lostFound', lostFoundRoute);
app.use('/nonFraternity', nonFraternityContractRoute);

//

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Listening at port ${PORT}`);
});