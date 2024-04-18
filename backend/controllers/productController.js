import { connection } from "../config/db.js";

const sqlByCategory =
  "SELECT DISTINCT product_specification FROM products WHERE product_specification IN ('fries', 'burger', 'drinks')";

const getCategory = (req, res) => {
  connection.query(sqlByCategory, (error, result) => {
    if (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Failed to fetch category" });
      return;
    }
    res.json(result);
  });
};

const sqlAllBurger =
  "SELECT * FROM products WHERE product_specification = 'burger'";
const getAllBurger = (req, res) => {
  connection.query(sqlAllBurger, (error, result) => {
    if (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Failed to fetch category" });
      return;
    }
    res.json(result);
  });
};


const sqlAllFries =
  "SELECT * FROM products WHERE product_specification = 'fries'";
const getAllFries = (req, res) => {
  connection.query(sqlAllFries, (error, result) => {
    if (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Failed to fetch category" });
      return;
    }
    res.json(result);
  });
}

const sqlAllDrinks =
  "SELECT * FROM products WHERE product_specification = 'drinks'";
const getAllDrinks = (req, res) => {
  connection.query(sqlAllDrinks, (error, result) => {
    if (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Failed to fetch category" });
      return;
    }
    res.json(result);
  });
};

const sqlItemById = "SELECT * FROM products WHERE id = ?";
const getItemById = (id, req,res) => {
  connection.query(sqlItemById, [id], (error, result) => {
    if (error) {
      console.error("Error fetching item:", error);
      res.status(500).json({ error: "Failed to fetch item" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.json(result[0]);
  });
};



const sqlAllPizza =
  "SELECT * FROM products WHERE product_specification = 'pizza'";
const getAllPizza = (req, res) => {
  connection.query(sqlAllPizza, (error, result) => {
    if (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Failed to fetch category" });
      return;
    }
    res.json(result);
  });
};

const sqlAllSandwiches =
  "SELECT * FROM products WHERE product_specification = 'sandwich'";
const getAllSandwiches = (req, res) => {
  connection.query(sqlAllSandwiches, (error, result) => {
    if (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Failed to fetch category" });
      return;
    }
    res.json(result);
  });
};




export { getCategory,getAllBurger,getAllDrinks, getAllFries,getItemById,getAllPizza,getAllSandwiches };
