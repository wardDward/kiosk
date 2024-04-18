import express from "express";
import {
  getAllBurger,
  getAllFries,
  getAllDrinks,
  getCategory,
  getItemById,
  getAllPizza,
  getAllSandwiches
} from "../controllers/productController.js";

const router = express.Router();

router.get("/categories", getCategory);
router.get("/burgers", getAllBurger);
router.get("/fries", getAllFries);
router.get("/drinks", getAllDrinks);
router.get("/pizzas", getAllPizza);
router.get("/sandwiches", getAllSandwiches);
router.get("/:id", (req,res) => {
  const itemId = req.params.id;
  getItemById(itemId, req, res);
});

export default router;
