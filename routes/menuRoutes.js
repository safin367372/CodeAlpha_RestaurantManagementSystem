const express = require("express");

const {
  createMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");
console.log({
  createMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
});

const router = express.Router();

router.route("/")
  .get(getMenuItems)
  .post(createMenuItem);

router.route("/:id")
  .get(getMenuItem)
  .put(updateMenuItem)
  .delete(deleteMenuItem);

module.exports = router;