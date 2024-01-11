const express = require('express');
const router = express.Router();
const database = require('../routes/database'); // Import your database module

// Define rendering routes for views

// Render the main landing page (index.ejs)
router.get('/', (req, res) => {
  res.render('index');
});

// Render the calendar view (calendar.ejs)
router.get('/calendar', (req, res) => {
  res.render('calendar');
});

// Render the customers view (customers.ejs)
router.get('/customers', (req, res) => {
  database.getCustomers((err, customers) => {
    if (err) {
      console.error('Error fetching customers:', err);
      return res.status(500).send('Database error');
    } else {
      res.render('customers', { customers });
    }
  });
});

// Route to render the edit customer page
router.get('/customers/edit/:id', (req, res) => {
  const customerId = parseInt(req.params.id);

  // Fetch the customer data from the database
  database.getCustomerById(customerId, (err, customer) => {
    if (err) {
      console.error('Error fetching customer:', err);
      // Handle the error, e.g., render an error page or redirect
    } else {
      // Render the "editCustomer.ejs" view and pass the 'customer' data
      res.render('editCustomer', { customer });
    }
  });
});

// Render the purchase orders view (purchaseOrders.ejs)
router.get('/purchaseOrders', (req, res) => {
  // Fetch purchase orders from the database (sample function for illustration)
  database.getPurchaseOrders((err, purchaseOrders) => {
    if (err) {
      console.error('Error fetching purchase orders:', err);
      return res.status(500).send('Database error');
    }

    // Fetch customer data from the database
    database.getCustomers((err, customers) => {
      if (err) {
        console.error('Error fetching customers:', err);
        // Handle the error, e.g., render an error page or redirect
      } else {
        // Render the purchase orders view (purchaseOrders.ejs) with the purchaseOrders and customers data
        res.render('purchaseOrders', { purchaseOrders, customers });
      }
    });
  });
});

// Render the "Add Purchase Order" form with customer data
router.get('/purchaseOrders/add', (req, res) => {
  database.getCustomers((err, customers) => {
    if (err) {
      console.error('Error fetching customers:', err);
      return res.status(500).send('Database error');
    } else {
      res.render('addPurchaseOrder', { customers });
    }
  });
});

// Render the parts view (parts.ejs)
router.get('/parts', (req, res) => {
  database.getParts((err, parts) => {
    if (err) {
      console.error('Error fetching parts:', err);
      return res.status(500).send('Database error');
    } else {
      res.render('parts', { parts });
    }
  });
});

// Route to render the edit part page
router.get('/parts/edit/:id', (req, res) => {
  const partId = parseInt(req.params.id);

  // Fetch the part data from the database
  database.getPartById(partId, (err, part) => {
    if (err) {
      console.error('Error fetching part:', err);
      // Handle the error, e.g., render an error page or redirect
    } else {
      // Render the "editPart.ejs" view and pass the 'part' data
      res.render('editPart', { part });
    }
  });
});

// Render the invoices view (invoices.ejs)
router.get('/invoices', (req, res) => {
  database.getInvoices((err, invoices) => {
    if (err) {
      console.error('Error fetching invoices:', err);
      return res.status(500).send('Database error');
    } else {
      res.render('invoices', { invoices });
    }
  });
});

// Route to render the edit purchase order page
router.get('/purchaseOrders/edit/:id', (req, res) => {
  const orderId = req.params.id;

  // Fetch deliveries associated with the purchase order
  database.getDeliveriesForPurchaseOrder(orderId, (err, deliveries) => {
    if (err) {
      console.error('Error fetching deliveries:', err);
      // Handle the error, e.g., render an error page or redirect
    } else {
      // Fetch the list of customers from the database
      database.getCustomers((err, customers) => {
        if (err) {
          console.error('Error fetching customers:', err);
          // Handle the error, e.g., render an error page or redirect
        } else {
          // Assuming you have a function to fetch orderDate, purchaseOrderNumber, and jobNumber based on orderId
          // Replace 'getOrderDetailsByOrderId' with the actual function to retrieve these values
          database.getOrderDetailsByOrderId(orderId, (err, data) => {
            if (err) {
              console.error('Error fetching order details:', err);
              // Handle the error, e.g., render an error page or redirect
            } else {
              const { orderDate, purchaseOrderNumber, jobNumber } = data;

              // Fetch the list of parts from the database
              database.getParts((err, parts) => {
                if (err) {
                  console.error('Error fetching parts:', err);
                  // Handle the error, e.g., render an error page or redirect
                } else {
                  // Render the "editPurchaseOrder.ejs" view and pass the 'orderId', 'orderDate', 'purchaseOrderNumber', 'jobNumber', 'deliveries', 'customers', and 'parts' data
                  res.render('editPurchaseOrder', {
                    orderId,
                    orderDate,
                    purchaseOrderNumber,
                    jobNumber,
                    deliveries,
                    customers,
                    parts,
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

// Route to render the "Add Delivery" form with part data
router.get('/purchaseOrders/addDelivery/:orderId', (req, res) => {
  // Fetch the list of parts from the database
  const orderId = req.params.orderId;
  database.getParts((err, parts) => {
    if (err) {
      console.error('Error fetching parts:', err);
      return res.status(500).send('Database error');
    } else {
      // Render the "addDelivery.ejs" view and pass the 'parts' data
      res.render('addDelivery', { parts, orderId });
    }
  });
});

module.exports = router;
