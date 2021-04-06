const express = require("express");
const ratesController = require("../controllers/ratesController");
const staffController = require("../controllers/staffController");
const router = express.Router();

router.get("/", staffController.protect, ratesController.getRates);
router.put("/", staffController.protect, ratesController.updateRates);

module.exports = router;
