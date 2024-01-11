const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

// Function to fetch all customers from the Customers table
function getCustomers(callback) {
  const query = 'SELECT * FROM Customers';

  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error fetching customers:', err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

// Function to fetch all contacts for a specific customer by CustomerID
function getContactsByCustomerID(customerID, callback) {
  const query = 'SELECT * FROM Contacts WHERE CustomerID = ?';

  db.all(query, [customerID], (err, rows) => {
    if (err) {
      console.error('Error fetching contacts:', err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

// Function to fetch all purchase orders from the PurchaseOrders table
function getPurchaseOrders(callback) {
  const query = 'SELECT * FROM PurchaseOrders';

  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error fetching purchase orders:', err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

// Function to fetch all deliveries for a specific purchase order by OrderID
function getDeliveriesForPurchaseOrder(orderID, callback) {
  const query = 'SELECT * FROM Deliveries WHERE OrderID = ?';

  db.all(query, [orderID], (err, rows) => {
    if (err) {
      console.error('Error fetching deliveries:', err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

// Function to fetch all parts from the Parts table
function getParts(callback) {
  const query = 'SELECT * FROM Parts';

  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error fetching parts:', err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

// Function to fetch all invoices from the Invoices table
function getInvoices(callback) {
  const query = 'SELECT * FROM Invoices';

  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error fetching invoices:', err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

// Function to insert a new delivery
function insertDelivery(orderId, deliveryDate, callback) {
  const sql = 'INSERT INTO Deliveries (OrderID, DeliveryDate) VALUES (?, ?)';
  db.run(sql, [orderId, deliveryDate], (err) => {
    if (err) {
      console.error(err.message);
      return callback(err);
    }
    console.log(`New delivery inserted with ID ${this.lastID}`);
    callback(null, this.lastID);
  });
}

// Function to retrieve deliveries for a specific purchase order
function getDeliveriesByOrderId(orderId, callback) {
  const sql = 'SELECT * FROM Deliveries WHERE OrderID = ?';
  db.all(sql, [orderId], (err, rows) => {
    if (err) {
      console.error(err.message);
      return callback(err);
    }
    callback(null, rows);
  });
}

// Function to fetch orderDate for a specific purchase order by OrderID
function getOrderDateByOrderId(orderID, callback) {
  const query = 'SELECT OrderDate FROM PurchaseOrders WHERE OrderID = ?';

  db.get(query, [orderID], (err, row) => {
    if (err) {
      console.error('Error fetching orderDate:', err);
      callback(err, null);
    } else {
      if (row) {
        callback(null, row.OrderDate);
      } else {
        callback(null, null); // Order with given ID not found
      }
    }
  });
}

// Function to retrieve order date and purchase order number by OrderID
function getOrderDateAndPurchaseOrderNumberByOrderId(orderId, callback) {
  const sql = 'SELECT OrderDate, PurchaseOrderNumber FROM PurchaseOrders WHERE OrderID = ?';
  db.get(sql, [orderId], (err, row) => {
    if (err) {
      console.error(err.message);
      return callback(err);
    }
    if (!row) {
      return callback(new Error(`Order with ID ${orderId} not found`));
    }
    callback(null, { orderDate: row.OrderDate, purchaseOrderNumber: row.PurchaseOrderNumber });
  });
}

// Function to retrieve order details by order ID
function getOrderDetailsByOrderId(orderId, callback) {
  const query = 'SELECT * FROM PurchaseOrders WHERE OrderID = ?';

  db.get(query, [orderId], (err, row) => {
    if (err) {
      console.error('Error fetching order details:', err);
      callback(err, null);
    } else {
      callback(null, row);
    }
  });
}

// Other database functions...

module.exports = {
  getOrderDetailsByOrderId,
  // Other database functions...
};
// Add other database functions as needed

module.exports = {
  getCustomers,
  getContactsByCustomerID,
  getPurchaseOrders,
  getDeliveriesForPurchaseOrder,
  getOrderDetailsByOrderId,
  getOrderDateByOrderId,
  getParts,
  getInvoices,
  insertDelivery,
  getDeliveriesByOrderId,
  getOrderDateAndPurchaseOrderNumberByOrderId, // Add the new function here
  // Add more functions for other database operations as needed
};
