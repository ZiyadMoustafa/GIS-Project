const express = require("express");
const attendenceController = require("../controllers/attendanceController");

const router = express.Router();

router.post("/checkin", attendenceController.checkin);
router.post("/checkout", attendenceController.checkout);

router.get(
  "/employee/:id",
  attendenceController.getAllAttendanceRecordsForEmployee
);

router.get("/today/:id", attendenceController.getTodayAttendanceForEmployee);

router.get("/", attendenceController.getAllAttendanceRecords);

router.get("/within-range", attendenceController.checkIfWithinRange);

module.exports = router;
