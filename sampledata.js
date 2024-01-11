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
  } catch (err) {
    console.error('Error creating tables:', err.message);
  }
}


// Function to insert sample data into the Customers table
async function insertSampleCustomers() {
  return new Promise((resolve, reject) => {
    const customers = [
      {
        CustomerID: 1,
        CustomerName: 'ABC Company',
        MailingAddress: {
          street: '123 Main St',
          aptSte: 'Apt 101',
          city: 'New York',
          state: 'NY',
          zip: '10001',
        },
        ShippingAddress: {
          street: '456 Elm St',
          aptSte: 'Suite 201',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90001',
        },
        ContactPerson: 'John Doe',
        ContactEmail: 'john@example.com',
        ContactPhone: '123-456-7890',
      },
      {
        CustomerID: 2,
        CustomerName: 'XYZ Corporation',
        MailingAddress: {
          street: '789 Oak Ave',
          aptSte: 'Unit B',
          city: 'Chicago',
          state: 'IL',
          zip: '60601',
        },
        ShippingAddress: {
          street: '321 Cedar Rd',
          aptSte: 'Floor 5',
          city: 'Miami',
          state: 'FL',
          zip: '33101',
        },
        ContactPerson: 'Jane Smith',
        ContactEmail: 'jane@example.com',
        ContactPhone: '987-654-3210',
      },
      // Add more customer data as needed
    ];

    const insertCustomerPromises = customers.map((customer) => {
      return new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO Customers (CustomerID, CustomerName, MailingAddressStreet, MailingAddressAptSte, MailingAddressCity, MailingAddressState, MailingAddressZip, ShippingAddressStreet, ShippingAddressAptSte, ShippingAddressCity, ShippingAddressState, ShippingAddressZip, ContactPerson, ContactEmail, ContactPhone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            customer.CustomerID,
            customer.CustomerName,
            customer.MailingAddress.street,
            customer.MailingAddress.aptSte,
            customer.MailingAddress.city,
            customer.MailingAddress.state,
            customer.MailingAddress.zip,
            customer.ShippingAddress.street,
            customer.ShippingAddress.aptSte,
            customer.ShippingAddress.city,
            customer.ShippingAddress.state,
            customer.ShippingAddress.zip,
            customer.ContactPerson,
            customer.ContactEmail,
            customer.ContactPhone,
          ],
          (err) => {
            if (err) {
              console.error(err.message);
              reject(err);
            } else {
              console.log('Inserted a customer record');
              resolve();
            }
          }
        );
      });
    });

    Promise.all(insertCustomerPromises)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}

// Function to insert sample data into the Contacts table
async function insertSampleContacts() {
  return new Promise((resolve, reject) => {
    const contacts = [
      {
        CustomerID: 1, // Assume the CustomerID of ABC Company is 1
        ContactName: 'Sarah Johnson',
        Email: 'sarah@example.com',
        Phone: '555-123-4567',
      },
      {
        CustomerID: 2, // Assume the CustomerID of XYZ Corporation is 2
        ContactName: 'Michael Brown',
        Email: 'michael@example.com',
        Phone: '555-987-6543',
      },
      // Add more contact data as needed
    ];

    const insertContactPromises = contacts.map((contact) => {
      return new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO Contacts (CustomerID, ContactName, Email, Phone) VALUES (?, ?, ?, ?)',
          [contact.CustomerID, contact.ContactName, contact.Email, contact.Phone],
          (err) => {
            if (err) {
              console.error(err.message);
              reject(err);
            } else {
              console.log('Inserted a contact record');
              resolve();
            }
          }
        );
      });
    });

    Promise.all(insertContactPromises)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}

// Continue with functions for other tables in a similar manner

// Call functions to insert sample data for all tables using async/await
async function insertSampleData() {
  try {
    await insertSampleCustomers();
    await insertSampleContacts();
    // Continue with other table insertion functions here
  } catch (err) {
    console.error('Error inserting sample data:', err.message);
  } finally {
    // Close the database connection when done
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Sample data insertion completed. Database connection closed.');
      }
    });
  }
}

// Function to insert sample data into the PurchaseOrders table
async function insertSamplePurchaseOrders() {
  // Sample data for PurchaseOrders
  const purchaseOrders = [
    {
      CustomerID: 1, // Assume the CustomerID of ABC Company is 1
      OrderDate: '2023-01-15',
      PurchaseOrderNumber: 'PO123',
      JobNumber: 'J123',
      Status: 'Pending',
    },
    {
      CustomerID: 2, // Assume the CustomerID of XYZ Corporation is 2
      OrderDate: '2023-02-20',
      PurchaseOrderNumber: 'PO456',
      JobNumber: 'J456',
      Status: 'Shipped',
    },
    // Add more purchase order data as needed
  ];

  const insertPurchaseOrderPromises = purchaseOrders.map((order) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO PurchaseOrders (CustomerID, OrderDate, PurchaseOrderNumber, JobNumber, Status) VALUES (?, ?, ?, ?, ?)',
        [
          order.CustomerID,
          order.OrderDate,
          order.PurchaseOrderNumber,
          order.JobNumber,
          order.Status,
        ],
        (err) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            console.log('Inserted a purchase order record');
            resolve();
          }
        }
      );
    });
  });

  await Promise.all(insertPurchaseOrderPromises);
}

// Function to insert sample data into the PurchaseOrderItems table
async function insertSamplePurchaseOrderItems() {
  // Sample data for PurchaseOrderItems
  const purchaseOrderItems = [
    {
      OrderID: 1, // Assume the OrderID of the first purchase order
      PartID: 1, // Assume the PartID of the first part
      Quantity: 100,
    },
    {
      OrderID: 2, // Assume the OrderID of the second purchase order
      PartID: 2, // Assume the PartID of the second part
      Quantity: 200,
    },
    // Add more purchase order item data as needed
  ];

  const insertPurchaseOrderItemPromises = purchaseOrderItems.map((item) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO PurchaseOrderItems (OrderID, PartID, Quantity) VALUES (?, ?, ?)',
        [item.OrderID, item.PartID, item.Quantity],
        (err) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            console.log('Inserted a purchase order item record');
            resolve();
          }
        }
      );
    });
  });

  await Promise.all(insertPurchaseOrderItemPromises);
}

// Function to insert sample data into the Deliveries table
async function insertSampleDeliveries() {
  // Sample data for Deliveries
  const deliveries = [
    {
      OrderID: 1, // Assume the OrderID of the first purchase order
      DeliveryDate: '2023-01-25',
      PartID: 1, // Assume the PartID of the first part
      Quantity: 100,
      Status: 'Delivered',
      InvoiceID: 1, // Assume the InvoiceID of the first invoice
    },
    {
      OrderID: 2, // Assume the OrderID of the second purchase order
      DeliveryDate: '2023-02-28',
      PartID: 2, // Assume the PartID of the second part
      Quantity: 200,
      Status: 'In Progress',
      InvoiceID: null, // No invoice associated
    },
    // Add more delivery data as needed
  ];

  const insertDeliveryPromises = deliveries.map((delivery) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO Deliveries (OrderID, DeliveryDate, PartID, Quantity, Status, InvoiceID) VALUES (?, ?, ?, ?, ?, ?)',
        [
          delivery.OrderID,
          delivery.DeliveryDate,
          delivery.PartID,
          delivery.Quantity,
          delivery.Status,
          delivery.InvoiceID,
        ],
        (err) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            console.log('Inserted a delivery record');
            resolve();
          }
        }
      );
    });
  });

  await Promise.all(insertDeliveryPromises);
}

// Function to insert sample data into the Parts table
async function insertSampleParts() {
  // Sample data for Parts
  const parts = [
    {
      PartNumber: 'P001',
      PartName: 'Widget A',
      Description: 'High-quality widget',
      ItemsPerBox: 50,
      BoxesPerPallet: 10,
      PartPrice: 5.99,
    },
    {
      PartNumber: 'P002',
      PartName: 'Widget B',
      Description: 'Widget with special features',
      ItemsPerBox: 40,
      BoxesPerPallet: 8,
      PartPrice: 7.99,
    },
    // Add more part data as needed
  ];

  const insertPartPromises = parts.map((part) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO Parts (PartNumber, PartName, Description, ItemsPerBox, BoxesPerPallet, PartPrice) VALUES (?, ?, ?, ?, ?, ?)',
        [
          part.PartNumber,
          part.PartName,
          part.Description,
          part.ItemsPerBox,
          part.BoxesPerPallet,
          part.PartPrice,
        ],
        (err) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            console.log('Inserted a part record');
            resolve();
          }
        }
      );
    });
  });

  await Promise.all(insertPartPromises);
}

// Function to insert sample data into the Invoices table
async function insertSampleInvoices() {
  // Sample data for Invoices
  const invoices = [
    {
      DeliveryIDs: '1', // Comma-separated DeliveryIDs associated with this invoice
      InvoiceDate: '2023-01-30',
      TotalAmount: 599.0, // Total amount for the first invoice
      PaidStatus: 'Paid',
    },
    {
      DeliveryIDs: '2', // Comma-separated DeliveryIDs associated with this invoice
      InvoiceDate: '2023-02-28',
      TotalAmount: 1598.0, // Total amount for the second invoice
      PaidStatus: 'Unpaid',
    },
    // Add more invoice data as needed
  ];

  const insertInvoicePromises = invoices.map((invoice) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO Invoices (DeliveryIDs, InvoiceDate, TotalAmount, PaidStatus) VALUES (?, ?, ?, ?)',
        [
          invoice.DeliveryIDs,
          invoice.InvoiceDate,
          invoice.TotalAmount,
          invoice.PaidStatus,
        ],
        (err) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            console.log('Inserted an invoice record');
            resolve();
          }
        }
      );
    });
  });

  await Promise.all(insertInvoicePromises);
}

// Continue with other table data insertion functions here

// Call functions to insert sample data for all tables using async/await
async function insertSampleData() {
  try {
    await insertSampleCustomers();
    await insertSampleContacts();
    await insertSamplePurchaseOrders();
    await insertSamplePurchaseOrderItems();
    await insertSampleDeliveries();
    await insertSampleParts();
    await insertSampleInvoices();
    // Continue with other table insertion functions here
  } catch (err) {
    console.error('Error inserting sample data:', err.message);
  } finally {
    // Close the database connection when done
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Sample data insertion completed. Database connection closed.');
      }
    });
  }
}

// Start inserting sample data
insertSampleData();
