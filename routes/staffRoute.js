const express = require("express");
const staffController = require("../controllers/staffController");

const router = express.Router();

router.get("/", staffController.getStaff);
router.post("/", staffController.createStaff);
router.put("/", staffController.updateStaff);

// router.get("/", staffController.protect, staffController.getStaff);
// router.post("/", staffController.protect, staffController.createStaff);
// router.put("/", staffController.protect, staffController.updateStaff);

module.exports = router;
