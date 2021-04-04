const express = require("express");
const ratesController = require("../controllers/ratesController");

const router = express.Router();

router.get("/", ratesController.getRates);
router.put("/", ratesController.updateRates);

module.exports = router;
