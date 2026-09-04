const express = require("express");

const {
  createReservation,
  getReservations,
  getReservation,
  cancelReservation,
} = require("../controllers/reservationController");

const router = express.Router();

router.route("/")
  .get(getReservations)
  .post(createReservation);

router.route("/:id")
  .get(getReservation)
  .delete(cancelReservation);

module.exports = router;