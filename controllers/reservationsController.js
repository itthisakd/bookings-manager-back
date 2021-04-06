const { sequelize, Reservation, BookedNight } = require("../models");
const { QueryTypes } = require("sequelize");

exports.getReservations = async (req, res, next) => {
  try {
    const result = await sequelize.query(
      "SELECT r.id reservation_id, in_date, out_date, remarks, paid, b.booking_status, r.created_at, r.updated_at, guest_name, email, phone_number, s.name staff_name FROM reservations r JOIN booking_statuses b ON r.booking_status_id = b.id JOIN staffs s ON s.id = r.staff_id",
      { type: QueryTypes.SELECT }
    );
    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.getEnquiries = async (req, res, next) => {
  try {
    const result = await sequelize.query(
      'SELECT r.id reservation_id, in_date, out_date, remarks, paid, b.booking_status, r.created_at, r.updated_at, guest_name, email, phone_number, s.name staff_name FROM reservations r JOIN booking_statuses b ON r.booking_status_id = b.id JOIN staffs s ON s.id = r.staff_id WHERE booking_status = "enquiry"',
      { type: QueryTypes.SELECT }
    );
    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};

// TO CHECK VACANCY
exports.getAllBookedNights = async (req, res, next) => {
  try {
    const result = await sequelize.query(
      `SELECT nightly_date, room_id, name room_name, rate FROM booked_nights bn JOIN rooms rs ON bn.room_id = rs.id JOIN room_types rt ON rt.id = rs.room_type_id JOIN reservations r ON r.id = bn.reservation_id`,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.getBookedNightsById = async (req, res, next) => {
  try {
    const id = 1; //** CHANGE HERE */
    const result = await sequelize.query(
      `SELECT nightly_date, room_id, name room_name, rate FROM booked_nights bn JOIN rooms rs ON bn.room_id = rs.id JOIN room_types rt ON rt.id = rs.room_type_id WHERE bn.reservation id = ${id}`,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.deleteReservation = async (req, res, next) => {
  try {
    const id = 1; //** CHANGE HERE */
    const resv = await Reservation.findOne({
      where: { id },
    });
    if (!resv)
      return res
        .status(400)
        .json({ message: "Reservation with such ID not found" });
    await Reservation.destroy({ where: { id } });
    res.status(204).json({ message: "Reservation deleted successfully" });
  } catch (err) {
    next(err);
  }
};

exports.deleteBookedNightsById = async (req, res, next) => {
  try {
    const resId = 1; //** CHANGE HERE */
    const bookedRes = await BookedNight.findAll({
      where: { reservation_id: resId },
    });
    if (!bookedRes)
      return res
        .status(400)
        .json({ message: "Reservation with such ID not found" });
    await BookedNight.destroy({ where: { reservation_id: resId } });
    res.status(204).json({ message: "bookedNights deleted successfully" });
  } catch (err) {
    next(err);
  }
};

exports.createReservation = async (req, res, next) => {
  try {
    const { inDate, outDate, guestName, email, phoneNumber } = req.body;

    await Reservation.create({
      inDate,
      outDate,
      guestName,
      email,
      phoneNumber,
      paid: 0,
      bookingStatusId: 4,
    });

    res.status(201).json({ message: "Reservation created successfully" });
  } catch (err) {
    next(err);
  }
};

exports.createBookedNights = async (req, res, next) => {
  try {
    const { resId, bookedNights } = req.body;

    bookedNights.forEach(async (night) => {
      await BookedNight.create({
        reservationId: resId,
        nightlyDate: night.nightlyDate,
        roomId: night.roomId,
      });
    });

    res.status(201).json({ message: "Reservation created successfully" });
  } catch (err) {
    next(err);
  }
};
// FORMAT OF BODY
// const obj = {
//   resId: 1,
//   bookedNights: [
//     {
//       nightlyDate: new Date(2021, 6, 6),
//       roomId: 2201,
//     },
//     {
//       nightlyDate: new Date(2021, 6, 7),
//       roomId: 2201,
//     },
//   ],
// };

exports.updateReservation = async (req, res, next) => {
  try {
    const id = 1; //** CHANGE HERE */
    const { inDate, outDate, guestName, email, phoneNumber } = req.body;

    await Reservation.update(
      {
        inDate,
        outDate,
        guestName,
        email,
        phoneNumber,
        paid: 0,
        bookingStatusId: 4,
      },
      { where: { id } }
    );

    res.status(201).json({ message: "Reservation created successfully" });
  } catch (err) {
    next(err);
  }
};
