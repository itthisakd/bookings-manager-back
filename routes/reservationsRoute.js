const express = require("express");
const reservationsController = require("../controllers/reservationsController");
const staffController = require("../controllers/staffController");

const router = express.Router();

router.get(
  "/",
  // staffController.protect,
  reservationsController.getReservations
);

router.patch(
  "/",
  // staffController.protect,
  reservationsController.patchDetails
);

router.post(
  "/",
  // staffController.protect,
  reservationsController.createEnquiry
);

router.get(
  "/vacancy",
  // staffController.protect,
  reservationsController.getAllBookedNights
);

// router.put(
//   "/",
//   staffController.protect,
//   reservationsController.updateReservation
// );

module.exports = router;
