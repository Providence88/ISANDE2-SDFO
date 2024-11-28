# SDFO Information System

This project is a web application designed to manage student discipline cases, including functionalities for handling non-fraternity contracts, drug test consents, lost and found items, and disciplinary cases. The application is built using Node.js, Express, MongoDB, and Handlebars as the templating engine.

## Features

- User authentication and login
- Main dashboard for managing student discipline
- Modules for:
  - Non-fraternity contracts
  - Drug test consents
  - Lost and found items
  - Disciplinary cases

## Technologies Used

- **Node.js**: JavaScript runtime built on Chrome's V8 engine.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: NoSQL database for storing student discipline data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Handlebars**: Templating engine for rendering HTML views.

## Troubleshooting

If something doesnt work then

1. Delete node_modules (right click then delete it should have a pop up that says "move to recycle bin")

2. Open terminal then type in the prompt: 

    npm i

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Providence88/ISANDE2-SDFO.git

2. Navigate to the project directory:

    cd ISANDE2-SDFO

3. Install the required dependencies:

    npm install

4.  Set up your MongoDB database. Make sure MongoDB is  running and you have created a database named student-discipline

5.  Start the application:

    npm run start
