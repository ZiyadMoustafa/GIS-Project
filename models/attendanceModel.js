const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  checkinTime: {
    type: Date,
  },
  checkoutTime: {
    type: Date,
  },
  duration: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["check-in", "check-out"],
    required: true,
  },
});

attendanceSchema.index({ location: "2dsphere" });

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
