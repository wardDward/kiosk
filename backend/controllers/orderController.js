import { connection } from "../config/db.js";

let currentQueueNumber = 1; // Initialize currentQueueNumber
let lastResetDate = new Date().getDate(); // Initialize lastResetDate with the current date

const checkOutOrder = (req, res) => {
  const { type, orders, total_price } = req.body;

  // Check if the current date is different from the last reset date
  const currentDate = new Date().getDate();
  if (currentDate !== lastResetDate) {
    currentQueueNumber = 1; // Reset currentQueueNumber to 1
    lastResetDate = currentDate; // Update lastResetDate to the current date
  }

  // Convert orders array to JSON string
  const ordersJson = JSON.stringify(orders);

  let queueNumber = currentQueueNumber; // Assign the current queue number
  currentQueueNumber++; // Increment queue number for the next order

  // Insert orders into the database
  connection.query(
    "INSERT INTO orders (order_items, order_status, order_type, price, queue_number) VALUES (?, ?, ?, ?, ?)",
    [ordersJson, "not paid", type, total_price, queueNumber], // Assuming the price comes from the request body
    (err, result) => {
      if (err) {
        console.error("Error creating orders:", err);
        res.status(500).json({ error: "Error creating orders", details: err });
        return;
      }

      console.log("Orders created successfully");
      res.status(201).json({
        message: "Orders created successfully",
        orderId: result.insertId,
        queueNumber: queueNumber, // Sending queueNumber in the response
      });
    }
  );
};

const queryString = "SELECT * FROM orders WHERE DATE(order_date) = ?";
const getOrdersByDay = (req, res) => {
  const currentDate = new Date().toISOString().slice(0, 10);
  console.log(currentDate);
  connection.query(queryString, [currentDate], (error, result) => {
    if (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Failed to fetch category" });
      return;
    }
    res.json(result);
  });
};

const query = "SELECT * FROM orders WHERE DATE(order_date) = ? and id = ?";

const getOrderById = (req, res) => {
  const id = req.params.id;
  const currentDate = new Date().toISOString().slice(0, 10);
  console.log(currentDate);
  connection.query(query, [currentDate, id], (error, result) => {
    if (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Failed to fetch category" });
      return;
    }
    res.json(result);
  });
};

// cashier
const checkOutOrderCashier = (req, res) => {
  const { type, orders, total_price } = req.body;
  // Check if the current date is different from the last reset date
  const currentDate = new Date().getDate();
  if (currentDate !== lastResetDate) {
    currentQueueNumber = 1; // Reset currentQueueNumber to 1
    lastResetDate = currentDate; // Update lastResetDate to the current date
  }
  // Convert orders array to JSON string
  const ordersJson = JSON.stringify(orders);

  let queueNumber = currentQueueNumber; // Assign the current queue number
  currentQueueNumber++; // Increment queue number for the next order

  // Begin transaction
  connection.beginTransaction((err) => {
    if (err) {
      console.error("Error beginning transaction:", err);
      res
        .status(500)
        .json({ error: "Error beginning transaction", details: err });
      return;
    }

    // Insert into orders table
    connection.query(
      "INSERT INTO orders (order_items, order_status, order_type, price, queue_number) VALUES (?, ?, ?, ?, ?)",
      [ordersJson, "paid", type, total_price, queueNumber],
      (err, orderResult) => {
        if (err) {
          return connection.rollback(() => {
            console.error("Error creating orders:", err);
            res
              .status(500)
              .json({ error: "Error creating orders", details: err });
          });
        }

        const orderId = orderResult.insertId;

        // Insert into sales table
        connection.query(
          "INSERT INTO sales (order_id, total_amount) VALUES (?, ?)",
          [orderId, total_price],
          (err, salesResult) => {
            if (err) {
              return connection.rollback(() => {
                console.error("Error creating sales:", err);
                res
                  .status(500)
                  .json({ error: "Error creating sales", details: err });
              });
            }

            // Commit transaction
            connection.commit((err) => {
              if (err) {
                return connection.rollback(() => {
                  console.error("Error committing transaction:", err);
                  res.status(500).json({
                    error: "Error committing transaction",
                    details: err,
                  });
                });
              }

              console.log("Transaction successfully committed");
              res.status(201).json({
                message: "Orders and sales created successfully",
                orderId: orderId,
                queueNumber: queueNumber,
              });
            });
          }
        );
      }
    );
  });
};

const paymentMethod = (req, res) => {
  const { orderId, paymentStyle, total_price } = req.body;

  // Insert orders into the database
  connection.query(
    "INSERT INTO payment (order_id, amount, payment_type, payment_status) VALUES (?, ?, ?, ?)",
    [orderId, total_price, paymentStyle, "paid"], // Assuming the price comes from the request boy
    (err, result) => {
      if (err) {
        console.error("Error creating orders:", err);
        res.status(500).json({ error: "Error creating orders", details: err });
        return;
      }

      console.log("Orders created successfully");
      res.status(201).json({
        message: "Orders created successfully",
        orderId: result.insertId,
      });
    }
  );
};

const updateOrder = (req, res) => {
  const { orderId, paymentStyle, total_price } = req.body;

  connection.beginTransaction((err) => {
    if (err) {
      console.error("Error beginning transaction:", err);
      res.status(500).json({ error: "Error beginning transaction", details: err });
      return;
    }

    // Update order status
    connection.query(
      "UPDATE orders SET order_status = ? WHERE id = ?",
      ["paid", orderId],
      (err, updateResult) => {
        if (err) {
          return connection.rollback(() => {
            console.error("Error updating orders:", err);
            res.status(500).json({ error: "Error updating orders", details: err });
          });
        }

        if (updateResult.affectedRows === 0) {
          return connection.rollback(() => {
            console.error("No orders found for orderId:", orderId);
            res.status(404).json({ error: "No orders found for orderId", orderId });
          });
        }

        // Insert into payment table
        connection.query(
          "INSERT INTO payment (order_id, amount, payment_type, payment_status) VALUES (?, ?, ?, ?)",
          [orderId, total_price, paymentStyle, "paid"],
          (err, paymentResult) => {
            if (err) {
              return connection.rollback(() => {
                console.error("Error creating payment:", err);
                res.status(500).json({ error: "Error creating payment", details: err });
              });
            }

            // Insert into sales table
            connection.query(
              "INSERT INTO sales (order_id, total_amount) VALUES (?, ?)",
              [orderId, total_price],
              (err, salesResult) => {
                if (err) {
                  return connection.rollback(() => {
                    console.error("Error creating sales:", err);
                    res.status(500).json({ error: "Error creating sales", details: err });
                  });
                }

                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      console.error("Error committing transaction:", err);
                      res.status(500).json({ error: "Error committing transaction", details: err });
                    });
                  }

                  console.log("Transaction successfully committed");
                  res.status(201).json({
                    message: "Orders, payment, and sales created successfully",
                    orderId: orderId,
                  });
                });
              }
            );
          }
        );
      }
    );
  });
};


export {
  checkOutOrder,
  getOrdersByDay,
  getOrderById,
  checkOutOrderCashier,
  paymentMethod,
  updateOrder,
};
