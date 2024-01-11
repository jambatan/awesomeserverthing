const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const sqlite3 = require('sqlite3').verbose(); // Import sqlite3 module
const path = require('path'); // Add this line to import the 'path' module

// Create a SQLite database connection
const db = new sqlite3.Database('./database.db');

// Middleware to set up static file serving (e.g., styles.css)
app.use(express.static('public'));

// Middleware to parse incoming JSON and urlencoded requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Import your render module
const render = require('./routes/render');
// Use the render module for rendering views
app.use(render);


// Import the routes
const purchaseOrders = require('./routes/purchaseOrders');

// Use the routes
app.use('/purchaseOrders', purchaseOrders);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
