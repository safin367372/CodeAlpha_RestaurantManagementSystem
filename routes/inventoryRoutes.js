const express = require("express");

const {
  createInventoryItem,
  getInventoryItems,
  getInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getLowStockItems,
} = require("../controllers/inventoryController");

const router = express.Router();

router.route("/")
  .get(getInventoryItems)
  .post(createInventoryItem);

router.get("/low-stock", getLowStockItems);

router.route("/:id")
  .get(getInventoryItem)
  .put(updateInventoryItem)
  .delete(deleteInventoryItem);

module.exports = router;