const { sequelize } = require("../models");
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
      "SELECT r.id id, in_date checkIn, out_date checkOut, remarks, paid, status, r.created_at createdAt, r.updated_at updatedAt, guest, email, phone_number phoneNumber, s.name staff FROM reservations r JOIN staffs s ON s.id = r.staff_id",
      { type: QueryTypes.SELECT }
    );

    const bookedNights = await sequelize.query(
      "SELECT reservation_id reservationId, room_id roomNum, nightly_date nightlyDate  FROM booked_nights bn  ",
      {
        type: QueryTypes.SELECT,
      }
    );

    const amount = await sequelize.query(
      "SELECT reservation_id reservationId, sum(rate) amount FROM booked_nights bn JOIN rooms r ON room_id = r.id JOIN room_types rt ON r.room_type_id = rt.id GROUP BY reservation_id",
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
    // console.log(" :>> ", amount[0]);
    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.patchDetails = async (req, res, next) => {
  try {
    const { id } = req.body;
    const objArr = Object.entries(req.body).slice(
      1,
      Object.entries(req.body).length
    );
    const str = objArr.map((prop) => `${prop[0]}="${prop[1]}"`).join(", ");

    await sequelize.query(
      `UPDATE reservations SET ${str}, updated_at="${DateTime.now().toString()}" WHERE id = ${id}`,
      {
        type: QueryTypes.UPDATE,
      }
    );

    res.status(200).json({ message: "Updated reservation successfully" });
  } catch (err) {
    next(err);
  }
};

exports.createEnquiry = async (req, res, next) => {
  try {
    const {
      guest,
      checkIn,
      checkOut,
      nightsChecked,
      status,
      staff_id,
    } = req.body;

    const id = await sequelize.query(
      `INSERT INTO reservations (guest, in_date, out_date, status, staff_id, paid, created_at, updated_at) VALUES ("${guest}", "${checkIn}", "${checkOut}", "${status}", "${staff_id}", 0, "${DateTime.now().toString()}", "${DateTime.now().toString()}");`,
      { type: QueryTypes.INSERT }
    );

    await sequelize.query(
      `INSERT INTO booked_nights (nightly_date, room_id, reservation_id)
      VALUES ${nightsChecked
        .map((e) => `("${e.date}", "${e.room}", "${id[0]}")`)
        .join(", ")}`,
      { type: QueryTypes.INSERT }
    );

    res.status(200).json({ message: "Enquiry created successfully" });
  } catch (err) {
    next(err);
  }
};

// TO CHECK VACANCY
exports.getAllBookedNights = async (req, res, next) => {
  try {
    const bookedNights = await sequelize.query(
      `SELECT reservation_id reservationId, room_id roomId, nightly_date nightlyDate FROM booked_nights`,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json({ bookedNights });
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

// exports.deleteReservation = async (req, res, next) => {
//   try {
//     const id = 1; //** CHANGE HERE */
//     const resv = await Reservation.findOne({
//       where: { id },
//     });
//     if (!resv)
//       return res
//         .status(400)
//         .json({ message: "Reservation with such ID not found" });
//     await Reservation.destroy({ where: { id } });
//     res.status(204).json({ message: "Reservation deleted successfully" });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.deleteBookedNightsById = async (req, res, next) => {
//   try {
//     const resId = 1; //** CHANGE HERE */
//     const bookedRes = await BookedNight.findAll({
//       where: { reservation_id: resId },
//     });
//     if (!bookedRes)
//       return res
//         .status(400)
//         .json({ message: "Reservation with such ID not found" });
//     await BookedNight.destroy({ where: { reservation_id: resId } });
//     res.status(204).json({ message: "bookedNights deleted successfully" });
//   } catch (err) {
//     next(err);
//   }
// };
