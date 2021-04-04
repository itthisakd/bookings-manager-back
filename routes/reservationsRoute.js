const express = require("express");
const reservationsController = require("../controllers/reservationsController");

const router = express.Router();

router.get("/", reservationsController.getReservations);
// router.get("/enquiry", reservationsController.getEnquiries);
// router.post("/", reservationsController.createReservation);
// router.put("/", reservationsController.updateReservation);
// router.delete("/", reservationsController.deleteReservation);

module.exports = router;
