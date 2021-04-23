const express = require("express");
const reservationsController = require("../controllers/reservationsController");
const staffController = require("../controllers/staffController");
const { upload } = require("../middlewares/upload");

const router = express.Router();

router.get(
  "/",
  staffController.protectUser,
  reservationsController.getReservations
);

router.patch(
  "/",
  staffController.protectUser,
  upload.single("image"),
  reservationsController.patchDetails
);

router.post(
  "/",
  staffController.protectUser,
  reservationsController.createEnquiry
);

router.get(
  "/vacancy",
  staffController.protectUser,
  reservationsController.getVacancy
);

router.delete(
  "/enquiry/:id",
  staffController.protectUser,
  reservationsController.deleteEnquiry
);

router.delete(
  "/nights/:id",
  staffController.protectUser,
  reservationsController.deleteNights
);

module.exports = router;
