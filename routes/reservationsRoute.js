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

// router.get(
//   "/enquiry",
//   staffController.protect,
//   reservationsController.getEnquiries
// );
// router.post(
//   "/",
//   staffController.protect,
//   reservationsController.createReservation
// );
// router.put(
//   "/",
//   staffController.protect,
//   reservationsController.updateReservation
// );

module.exports = router;
