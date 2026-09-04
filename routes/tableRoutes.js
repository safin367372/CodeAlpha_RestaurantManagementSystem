const express = require("express");

const {
  createTable,
  getTables,
  getTable,
  updateTable,
  deleteTable,
} = require("../controllers/tableController");

const router = express.Router();

router.route("/")
  .get(getTables)
  .post(createTable);

router.route("/:id")
  .get(getTable)
  .put(updateTable)
  .delete(deleteTable);

module.exports = router;