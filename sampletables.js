const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Function to create database tables
async function createTables() {
  try {
    // Create Customers table
    await db.run(`
      CREATE TABLE IF NOT EXISTS Customers (
        CustomerID INTEGER PRIMARY KEY AUTOINCREMENT,
        CustomerName TEXT,
        MailingAddressStreet TEXT,
        MailingAddressAptSte TEXT,
        MailingAddressCity TEXT,
        MailingAddressState TEXT,
        MailingAddressZip TEXT,
        ShippingAddressStreet TEXT,
        ShippingAddressAptSte TEXT,
        ShippingAddressCity TEXT,
        ShippingAddressState TEXT,
        ShippingAddressZip TEXT,
        ContactPerson TEXT,
        ContactEmail TEXT,
        ContactPhone TEXT
      )
    `);

    // Create Contacts table
    await db.run(`
      CREATE TABLE IF NOT EXISTS Contacts (
        ContactID INTEGER PRIMARY KEY AUTOINCREMENT,
        CustomerID INTEGER,
        ContactName TEXT,
        Email TEXT,
        Phone TEXT,
        FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
      )
    `);

    // Create PurchaseOrders table
    await db.run(`
      CREATE TABLE IF NOT EXISTS PurchaseOrders (
        OrderID INTEGER PRIMARY KEY AUTOINCREMENT,
        CustomerID INTEGER,
        OrderDate TEXT,
        PurchaseOrderNumber TEXT,
        JobNumber TEXT,
        Status TEXT,
        FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
      )
    `);

    // Create PurchaseOrderItems table
    await db.run(`
      CREATE TABLE IF NOT EXISTS PurchaseOrderItems (
        ItemID INTEGER PRIMARY KEY AUTOINCREMENT,
        OrderID INTEGER,
        PartID INTEGER,
        Quantity INTEGER,
        FOREIGN KEY (OrderID) REFERENCES PurchaseOrders(OrderID),
        FOREIGN KEY (PartID) REFERENCES Parts(PartID)
      )
    `);

    // Create Deliveries table
    await db.run(`
      CREATE TABLE IF NOT EXISTS Deliveries (
        DeliveryID INTEGER PRIMARY KEY AUTOINCREMENT,
        OrderID INTEGER,
        DeliveryDate TEXT,
        PartID INTEGER,
        Quantity INTEGER,
        Status TEXT,
        InvoiceID INTEGER,
        FOREIGN KEY (OrderID) REFERENCES PurchaseOrders(OrderID),
        FOREIGN KEY (PartID) REFERENCES Parts(PartID),
        FOREIGN KEY (InvoiceID) REFERENCES Invoices(InvoiceID)
      )
    `);

    // Create Parts table
    await db.run(`
      CREATE TABLE IF NOT EXISTS Parts (
        PartID INTEGER PRIMARY KEY AUTOINCREMENT,
        PartNumber TEXT,
        PartName TEXT,
        Description TEXT,
        ItemsPerBox INTEGER,
        BoxesPerPallet INTEGER,
        PartPrice REAL
      )
    `);

    // Create Invoices table
    await db.run(`
      CREATE TABLE IF NOT EXISTS Invoices (
        InvoiceID INTEGER PRIMARY KEY AUTOINCREMENT,
        DeliveryIDs TEXT,
        InvoiceDate TEXT,
        TotalAmount REAL,
        PaidStatus TEXT
      )
    `);

    console.log('Tables created successfully.');
  } catch (err) {
    console.error('Error creating tables:', err.message);
  } finally {
    // Close the database connection when done
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  }
}

// Call the function to create tables
createTables();
