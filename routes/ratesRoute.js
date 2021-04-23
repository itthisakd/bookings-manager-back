const express = require("express");
const ratesController = require("../controllers/ratesController");
const staffController = require("../controllers/staffController");
const router = express.Router();

router.get("/", staffController.protectUser, ratesController.getRates);
router.put("/", staffController.protectUser, ratesController.updateRates);

module.exports = router;
