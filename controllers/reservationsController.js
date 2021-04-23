const cloudinary = require("cloudinary").v2;
const fs = require("fs");
cloudinary.config({
  cloud_name: "itthisakd",
  api_key: "161784557926796",
  api_secret: "A_OyWIsFkAC_OeDer1w9dRYtEqg",
});

const { organise } = require("../utilities/organise");
const { sortNights } = require("../utilities/sortNights");
const {
  sequelize,
  BookedNight,
  Reservation,
  Room,
  RoomType,
} = require("../models");
const { QueryTypes } = require("sequelize");
const { DateTime } = require("luxon");
const util = require("util");
const upload = util.promisify(cloudinary.uploader.upload);

exports.getReservations = async (req, res, next) => {
  try {
    const details = await sequelize.query(
      "SELECT r.id id, in_date checkIn, out_date checkOut, remarks, paid, status, r.created_at createdAt, r.updated_at updatedAt, guest, email, phone_number phoneNumber, s.name staff, payment_slip paymentSlip FROM reservations r JOIN staffs s ON s.id = r.staff_id",
      { type: QueryTypes.SELECT }
    );

    const bookedNights = await sequelize.query(
      "SELECT reservation_id reservationId, room_id roomNum, nightly_date nightlyDate, rate FROM booked_nights bn  ",
      {
        type: QueryTypes.SELECT,
      }
    );

    const amount = await sequelize.query(
      "SELECT reservation_id reservationId, sum(rate) amount FROM booked_nights bn  GROUP BY reservation_id",
      {
        type: QueryTypes.SELECT,
      }
    );

    const rooms = await sequelize.query(
      "SELECT reservation_id reservationId, room_id num, nightly_date nightlyDate, rt.name type, bn.rate FROM booked_nights bn JOIN rooms r ON bn.room_id = r.id JOIN room_types rt ON rt.id = r.room_type_id ORDER BY reservationId, num, nightlyDate",
      {
        type: QueryTypes.SELECT,
      }
    );

    const result = details.map((detail) => {
      return {
        ...detail,
        amount:
          detail.status !== "cancelled"
            ? amount.filter((amt) => amt.reservationId === detail.id)[0]?.amount
            : Number(detail.remarks.split("Amount: ")[1].split(",")[0]).toFixed(
                2
              ),
        bookedNights: bookedNights?.filter(
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

exports.getVacancy = async (req, res, next) => {
  try {
    const nights = await sequelize.query(
      "SELECT reservation_id reservationId, room_id roomNum, nightly_date nightlyDate  FROM booked_nights bn  ",
      {
        type: QueryTypes.SELECT,
      }
    );

    const rooms = await sequelize.query(
      "SELECT r.id num, rt.name type, rt.rate rate FROM rooms r JOIN room_types rt ON room_type_id = rt.id",
      {
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).json({ rooms, bookedNights: sortNights(nights) });
  } catch (err) {
    next(err);
  }
};

exports.uploadFile = async (req, res, next) => {
  try {
    const result = await upload(req.file.path);
    fs.unlinkSync(req.file.path);
    const str = `"payment_slip="${result.secure_url}"`;

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

//200 update
//201 created
//204 delete

exports.patchDetails = async (req, res, next) => {
  try {
    const { id } = req.body;
    console.log("req :>> ", req);
    console.log("req.body :>> ", req.body);
    console.log("req.file :>> ", req.file);

    console.log("id", id);
    const objArr = Object.entries(req.body).slice(
      1,
      Object.entries(req.body).length
    );
    let str = objArr.map((prop) => `${prop[0]}="${prop[1]}"`).join(", ");

    console.log("str :>> ", str);
    if (req.file) {
      const result = await upload(req.file.path);
      fs.unlinkSync(req.file.path);
      str = str + `, payment_slip="${result.secure_url}"`;
    }
    console.log("NEWstr :>> ", str);

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
      `INSERT INTO reservations (guest, in_date, out_date, status, staff_id, paid, created_at, updated_at) VALUES ("${guest}", "${checkIn}", "${checkOut}", "${status}", "${staff_id}", 0, "${DateTime.now().toString()}", "${DateTime.now().toString()}")`,
      { type: QueryTypes.INSERT }
    );

    const rooms = await sequelize.query(
      `SELECT r.id num, rate from room_types rt JOIN rooms r ON r.room_type_id = rt.id`,
      { type: QueryTypes.SELECT }
    );

    const newNightsChecked = nightsChecked.map((night) => {
      return {
        ...night,
        rate: rooms.filter((room) => room.num === night.room)[0].rate,
      };
    });

    await sequelize.query(
      `INSERT INTO booked_nights (nightly_date, rate, room_id, reservation_id)
      VALUES ${newNightsChecked
        .map((e) => `("${e.date}", "${e.rate}", "${e.room}", "${id[0]}")`)
        .join(", ")}`,
      { type: QueryTypes.INSERT }
    );

    res.status(200).json({ message: "Enquiry created successfully" });
  } catch (err) {
    next(err);
  }
};

exports.deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    await BookedNight.destroy({ where: { reservationId: id } });
    await Reservation.destroy({ where: { id } });

    res.status(204).json({ message: "Enquiry deleted successfully" });
  } catch (err) {
    next(err);
  }
};

exports.deleteNights = async (req, res, next) => {
  try {
    const { id } = req.params;
    await BookedNight.destroy({ where: { reservationId: id } });

    res.status(204).json({ message: "Enquiry deleted successfully" });
  } catch (err) {
    next(err);
  }
};
