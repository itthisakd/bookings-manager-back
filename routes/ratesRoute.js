const express = require("express");
const ratesController = require("../controllers/ratesController");
const staffController = require("../controllers/staffController");
const router = express.Router();

router.get("/", staffController.protectAdmin, ratesController.getRates);
router.put("/", staffController.protectAdmin, ratesController.updateRates);

module.exports = router;
