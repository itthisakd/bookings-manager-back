const express = require("express");
const staffController = require("../controllers/staffController");

const router = express.Router();

router.get("/", staffController.protectAdmin, staffController.getStaff);
router.post("/", staffController.protectAdmin, staffController.createStaff);
router.patch(
  "/",
  staffController.protectAdmin,
  staffController.deactivateStaff
);
router.get("/getroles", staffController.getRoles);

module.exports = router;
