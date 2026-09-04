const Reservation = require("../models/Reservation");
const Table = require("../models/Table");

// Create a reservation
const createReservation = async (req, res) => {
  try {
    const { customerName, customerPhone, table, date, time, guests } = req.body;

    // 1. Find requested table
    const foundTable = await Table.findById(table);
    if (!foundTable) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    // 2. Check guest count against capacity
    if (guests > foundTable.capacity) {
      return res.status(400).json({
        success: false,
        message: `Table capacity is ${foundTable.capacity}, but ${guests} guests requested`,
      });
    }

    // 3. Check existing confirmed reservation for same table/date/time
    const conflict = await Reservation.findOne({
      table,
      date: new Date(date),
      time,
      status: "confirmed",
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: "Table already reserved for this date and time",
      });
    }

    // 4/5. Create reservation
    const reservation = await Reservation.create({
      customerName,
      customerPhone,
      table,
      date,
      time,
      guests,
    });

    res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      data: reservation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all reservations
const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("table")
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get one reservation
const getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate("table");

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid reservation ID",
    });
  }
};

// Cancel reservation
const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reservation cancelled successfully",
      data: reservation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createReservation,
  getReservations,
  getReservation,
  cancelReservation,
};