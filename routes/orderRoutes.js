const express = require("express");

const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

router.route("/")
  .get(getOrders)
  .post(createOrder);

router.get("/:id", getOrder);
router.put("/:id/status", updateOrderStatus);

module.exports = router;