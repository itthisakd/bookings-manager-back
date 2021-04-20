const { sequelize, Reservation, BookedNight } = require("../models");
const { QueryTypes } = require("sequelize");
const { DateTime } = require("luxon");

const organise = (arr) => {
  let obj = arr.reduce((map, val) => {
    if (!map[`${val.reservationId}-${val.num}`]) {
      map[`${val.reservationId}-${val.num}`] = [];
    }
    map[`${val.reservationId}-${val.num}`].push(val);
    return map;
  }, {});

  for (let prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      let temp = {
        reservationId: obj[prop][0].reservationId,
        num: obj[prop][0].num,
        type: obj[prop][0].type,
        rate: obj[prop][0].rate,
        checkIn: obj[prop][0].nightlyDate,
        checkOut: DateTime.fromISO(obj[prop][obj[prop].length - 1].nightlyDate)
          .plus({ days: 1 })
          .toString(),
      };
      obj[prop] = temp;
    }
  }
  return Object.values(obj);
};

exports.getReservations = async (req, res, next) => {
  try {
    const details = await sequelize.query(
      "SELECT r.id id, in_date checkIn, out_date checkOut, remarks, paid, b.booking_status status, r.created_at createdAt, r.updated_at updatedAt, guest_name guest, email, phone_number phoneNumber, s.name staff FROM reservations r JOIN booking_statuses b ON r.booking_status_id = b.id JOIN staffs s ON s.id = r.staff_id",
      { type: QueryTypes.SELECT }
    );

    const bookedNights = await sequelize.query(
      "SELECT reservation_id reservationId, room_id roomNum, nightly_date nightlyDate  FROM booked_nights bn  ",
      {
        type: QueryTypes.SELECT,
      }
    );

    const amount = await sequelize.query(
      "SELECT reservation_id reservationId, sum(rate) amount  FROM booked_nights bn JOIN rooms r ON room_id = r.id JOIN room_types rt ON r.room_type_id = rt.id GROUP BY reservation_id",
      {
        type: QueryTypes.SELECT,
      }
    );

    const rooms = await sequelize.query(
      "SELECT reservation_id reservationId, room_id num, nightly_date nightlyDate, rt.name type, rate FROM booked_nights bn JOIN rooms r ON bn.room_id = r.id JOIN room_types rt ON rt.id = r.room_type_id ORDER BY reservationId, num, nightlyDate",
      {
        type: QueryTypes.SELECT,
      }
    );

    const result = details.map((detail) => {
      return {
        ...detail,
        amount: amount.filter((amt) => amt.reservationId === detail.id)[0]
          .amount,
        bookedNights: bookedNights.filter(
          (night) => night.reservationId === detail.id
        ),
        rooms: organise(rooms).filter(
          (room) => room.reservationId === detail.id
        ),
      };
    });
    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.patchDetails = async (req, res, next) => {
  try {
    const { id, remarks, booking_status_id } = req.body;
    let result;
    if (remarks) {
      result = await sequelize.query(
        `UPDATE reservations SET remarks = "${remarks}" WHERE id = ${id}`,
        { type: QueryTypes.UPDATE }
      );
    } else if (booking_status_id) {
      result = await sequelize.query(
        `UPDATE reservations SET booking_status_id = "${booking_status_id}" WHERE id = ${id}`,
        { type: QueryTypes.UPDATE }
      );
    }

    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.createEnquiry = async (req, res, next) => {
  try {
    const { id, remarks, booking_status_id } = req.body;

    await sequelize.query(``, { type: QueryTypes.CREATE });

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
