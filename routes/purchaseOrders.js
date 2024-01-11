const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database.db');

// Route to display the purchase orders page with data from the database
router.get('/', (req, res) => {
  // Retrieve purchase orders from the database
  const selectQuery = `
    SELECT PurchaseOrders.OrderID, Customers.CustomerName, PurchaseOrders.OrderDate,
           PurchaseOrders.PurchaseOrderNumber, PurchaseOrders.JobNumber, PurchaseOrders.Status
    FROM PurchaseOrders
    INNER JOIN Customers ON PurchaseOrders.CustomerID = Customers.CustomerID
  `;

  db.all(selectQuery, [], (err, purchaseOrders) => {
    if (err) {
      console.error(err.message);
      // Handle the error and provide feedback to the user
      return res.status(500).send('Internal Server Error');
    }

    // Render the purchase orders page with the data from the database
    res.render('purchaseOrders', { purchaseOrders });
  });
});

// Route to display the form for adding a new purchase order
router.get('/add', (req, res) => {
  // Fetch customer data from the database
  const selectCustomersQuery = 'SELECT CustomerID, CustomerName FROM Customers';

  db.all(selectCustomersQuery, [], (err, customers) => {
    if (err) {
      console.error(err.message);
      // Handle the error and provide feedback to the user
      return res.status(500).send('Internal Server Error');
    }

    // Render the "addPurchaseOrder.ejs" view and pass the customer data
    res.render('addPurchaseOrder', { customers });
  });
});

// Route to handle the creation of a new purchase order
router.post('/purchaseOrders/add', (req, res) => {
    const {
      customer,
      orderDate,
      purchaseOrderNumber,
      jobNumber,
      status,
    } = req.body;
  
    console.log('Selected Customer:', customer); // Log the selected customer name
  
  // Retrieve the customer ID based on the customer name
  const selectCustomerQuery = 'SELECT CustomerID FROM Customers WHERE CustomerName = ?';

  db.get(selectCustomerQuery, [customer], (err, customerRow) => {
    if (err) {
      console.error(err.message);
      // Handle the error and provide feedback to the user
      return res.status(500).send('Internal Server Error');
    }

    if (!customerRow) {
      // Customer not found
      return res.status(404).send('Customer not found');
    }

    const customerID = customerRow.CustomerID;

    // Insert the new purchase order into the database
    const insertQuery = `
      INSERT INTO PurchaseOrders (CustomerID, OrderDate, PurchaseOrderNumber, JobNumber, Status)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
      insertQuery,
      [customerID, orderDate, purchaseOrderNumber, jobNumber, status],
      function (err) {
        if (err) {
          console.error(err.message);
          // Handle the error and provide feedback to the user
          return res.status(500).send('Internal Server Error');
        }

        // Redirect back to the purchase orders page after adding
        res.redirect('/purchaseOrders');
      }
    );
  });
});

// Route to display the form for editing a purchase order
router.get('/edit/:id', (req, res) => {
  const orderId = parseInt(req.params.id);

  // Fetch purchase order data for editing from the database
  const selectPurchaseOrderQuery = `
    SELECT PurchaseOrders.OrderID, Customers.CustomerName, PurchaseOrders.OrderDate,
           PurchaseOrders.PurchaseOrderNumber, PurchaseOrders.JobNumber, PurchaseOrders.Status
    FROM PurchaseOrders
    INNER JOIN Customers ON PurchaseOrders.CustomerID = Customers.CustomerID
    WHERE PurchaseOrders.OrderID = ?
  `;

  db.get(selectPurchaseOrderQuery, [orderId], (err, purchaseOrder) => {
    if (err) {
      console.error(err.message);
      // Handle the error and provide feedback to the user
      return res.status(500).send('Internal Server Error');
    }

    if (!purchaseOrder) {
      // Purchase order not found
      return res.status(404).send('Purchase Order not found');
    }

    // Fetch customer data for the dropdown
    const selectCustomersQuery = 'SELECT CustomerID, CustomerName FROM Customers';

    db.all(selectCustomersQuery, [], (err, customers) => {
      if (err) {
        console.error(err.message);
        // Handle the error and provide feedback to the user
        return res.status(500).send('Internal Server Error');
      }

      // Render the "editPurchaseOrder.ejs" view with the purchase order and customer data
      res.render('editPurchaseOrder', { purchaseOrder, customers });
    });
  });
});

router.post('/purchaseOrders/edit/:id', (req, res) => {
    const orderId = req.params.id;
  
    // Parse the form data from the request body
    const { customer, orderDate, purchaseOrderNumber, jobNumber, status } = req.body;
  
    // Update the purchase order in your database using the orderId and form data
  
    // Redirect to the purchaseOrders page or show a success message
  });
  

// Route to handle the form submission for editing purchase orders
router.post('/purchaseOrders/edit/:id', (req, res) => {
    if (req.body.editPurchaseOrder) {
        // Handle the form submission for editing purchase orders
        // ...

        // Redirect to the purchase orders page or show a success message
    }
});

// Route to handle the editing of a purchase order
router.put('/edit/:id', (req, res) => {
  const orderId = parseInt(req.params.id);
  const {
    customer,
    orderDate,
    purchaseOrderNumber,
    jobNumber,
    status,
  } = req.body;

  // Retrieve the customer ID based on the customer name
  const selectCustomerQuery = 'SELECT CustomerID FROM Customers WHERE CustomerName = ?';

  db.get(selectCustomerQuery, [customer], (err, customerRow) => {
    if (err) {
      console.error(err.message);
      // Handle the error and provide feedback to the user
      return res.status(500).send('Internal Server Error');
    }

    if (!customerRow) {
      // Customer not found
      return res.status(404).send('Customer not found');
    }

    const customerID = customerRow.CustomerID;

    // Update the purchase order in the database
    const updateQuery = `
      UPDATE PurchaseOrders
      SET CustomerID = ?, OrderDate = ?, PurchaseOrderNumber = ?, JobNumber = ?, Status = ?
      WHERE OrderID = ?
    `;

    db.run(
      updateQuery,
      [customerID, orderDate, purchaseOrderNumber, jobNumber, status, orderId],
      function (err) {
        if (err) {
          console.error(err.message);
          // Handle the error and provide feedback to the user
          return res.status(500).send('Internal Server Error');
        }

        // Redirect back to the purchase orders page after editing
        res.redirect('/purchaseOrders');
      }
    );
  });
});

// Route to handle the deletion of a purchase order
router.delete('/delete/:id', (req, res) => {
  const orderId = parseInt(req.params.id);

  // Delete the purchase order from the database
  const deleteQuery = 'DELETE FROM PurchaseOrders WHERE OrderID = ?';

  db.run(deleteQuery, [orderId], function (err) {
    if (err) {
      console.error(err.message);
      // Handle the error and provide feedback to the user
      return res.status(500).send('Internal Server Error');
    }

    // Redirect back to the purchase orders page after deleting
    res.redirect('/purchaseOrders');
  });
});

// Route to handle the creation of a new purchase order
router.post('/add', (req, res) => {
    const { customer, orderDate, purchaseOrderNumber, jobNumber, status, deliveryDate } = req.body;
  
    // Insert the new purchase order into the database
    database.insertPurchaseOrder(customer, orderDate, purchaseOrderNumber, jobNumber, status, (err, orderId) => {
      if (err) {
        // Handle the error and provide feedback to the user
        return res.status(500).send('Internal Server Error');
      }
  
      // Check if a delivery date was provided and insert a delivery record
      if (deliveryDate) {
        database.insertDelivery(orderId, deliveryDate, (err, deliveryId) => {
          if (err) {
            // Handle the error
            console.error(err.message);
          }
          // Redirect back to the purchase orders page after adding
          res.redirect('/purchaseOrders');
        });
      } else {
        // Redirect back to the purchase orders page after adding (without delivery)
        res.redirect('/purchaseOrders');
      }
    });
  });
  
// Route to handle the form submission for adding deliveries
router.post('/purchaseOrders/addDelivery/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    const { deliveryDate } = req.body;
  
    // Insert the new delivery into the Deliveries table and use orderId as a foreign key
    const insertQuery = `
      INSERT INTO Deliveries (OrderID, DeliveryDate)
      VALUES (?, ?)
    `;
  
    db.run(
      insertQuery,
      [orderId, deliveryDate],
      function (err) {
        if (err) {
          console.error(err.message);
          // Handle the error and provide feedback to the user
          return res.status(500).send('Internal Server Error');
        }
  
        // Redirect back to the purchase order or deliveries page after adding
        res.redirect('/purchaseOrders'); // or wherever you want to redirect
      }
    );
});

// Route to render the "Add Delivery" form with part data
router.get('/purchaseOrders/addDelivery/:orderId', (req, res) => {
    // Fetch the purchase order details based on orderId from URL params
    const orderId = req.params.orderId;
  
    // Fetch the available parts for selection (if needed)
    // ...
  
    // Render the "addDelivery.ejs" view with orderId and available parts (if needed)
    res.render('addDelivery', { orderId });
  });
  
  // Route to handle the form submission for adding deliveries
  router.post('/purchaseOrders/addDelivery/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    const { deliveryDate } = req.body;
  
    // Insert the new delivery into the Deliveries table and use orderId as a foreign key
    const insertQuery = `
      INSERT INTO Deliveries (OrderID, DeliveryDate)
      VALUES (?, ?)
    `;
  
    db.run(
      insertQuery,
      [orderId, deliveryDate],
      function (err) {
        if (err) {
          console.error(err.message);
          // Handle the error and provide feedback to the user
          return res.status(500).send('Internal Server Error');
        }
  
        // Redirect back to the purchase order or deliveries page after adding
        res.redirect('/purchaseOrders'); // or wherever you want to redirect
      }
    );
  });


// Route to handle the form submission for editing purchase orders
router.post('/purchaseOrders/edit/:id', (req, res) => {
    const orderId = req.params.id;
  
    // Parse the form data from the request body
    const { customer, orderDate, purchaseOrderNumber, jobNumber, status } = req.body;
  
    // Update the purchase order in your database using the orderId and form data
  
    // Redirect to the purchaseOrders page or show a success message
});


module.exports = router;
