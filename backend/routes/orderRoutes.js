import express from "express";

import {
  checkOutOrder,
  getOrderById,
  getOrdersByDay,
  checkOutOrderCashier,
  paymentMethod,
  updateOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", checkOutOrder);
router.get("/", getOrdersByDay);
router.get("/:id", getOrderById);
router.post("/cashier", checkOutOrderCashier);
router.post("/payment", paymentMethod);
router.put("/update", updateOrder);

export default router;
