import mysql from "mysql";

// Create a connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "kiosk",
});

// Connect to the database
const connectDB = () => {
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to database:", err);
      return;
    }
    console.log("Connected to database");
  });
};

// Export the connectDB function
export { connection, connectDB };
