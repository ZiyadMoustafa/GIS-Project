const axios = require("axios");
const Employee = require("../models/employeeModel");
const Organization = require("../models/organizationModel");
const Attendance = require("../models/attendanceModel");

const check = async (employeeId, lat, lng) => {
  // Check if employee exists
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    throw new Error("Employee not found");
  }

  // Check if organization exists
  const organization = await Organization.findById(employee.organization);
  if (!organization) {
    throw new Error("Organization not found");
  }

  // Calculate distance between employee and organization
  const origin = `${lat},${lng}`;
  const destination = `${organization.location.coordinates[1]},${organization.location.coordinates[0]}`;
  const googleMapsUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  const response = await axios.get(googleMapsUrl);
  const distanceInMeters = response.data.rows[0].elements[0].distance.value;

  return {
    employee,
    organization,
    distanceInMeters,
  };
};

exports.checkin = async (req, res) => {
  const { employeeId, lat, lng } = req.body;

  try {
    const { employee, organization, distanceInMeters } = await check(
      employeeId,
      lat,
      lng
    );

    const existingCheckin = await Attendance.findOne({
      employee: employeeId,
      type: "check-in",
      checkoutTime: { $exists: false },
    });

    if (existingCheckin) {
      return res.status(400).json({
        status: "fail",
        message: "You already checked in and haven't checked out yet.",
      });
    }
    // if within range -> create an attendance
    if (distanceInMeters <= 100) {
      const attendance = await Attendance.create({
        employee: employee._id,
        organization: organization._id,
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },
        checkinTime: new Date(),
        type: "check-in",
      });

      return res.status(201).json({
        status: "success",
        message: "Check-in done",
        attendance,
      });
    } else {
      return res.status(400).json({
        status: "fail",
        message: "You are too far from the organization ",
      });
    }
  } catch (error) {
    return res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.checkout = async (req, res) => {
  const { employeeId, lat, lng } = req.body;

  try {
    const { employee, organization, distanceInMeters } = await check(
      employeeId,
      lat,
      lng
    );

    const lastCheckin = await Attendance.findOne({
      employee: employeeId,
      type: "check-in",
      checkoutTime: { $exists: false },
    }).sort({ checkinTime: -1 });

    if (!lastCheckin)
      return res.status(404).json({
        status: "fail",
        message: "You haven't checked in yet or you've already checked out.",
      });

    if (distanceInMeters > 100) {
      return res.status(400).json({
        status: "fail",
        message: "You are too far from the organization ",
      });
    }

    // logs end time and calculates work duration
    lastCheckin.checkoutTime = new Date();
    lastCheckin.duration =
      (lastCheckin.checkoutTime - lastCheckin.checkinTime) / 1000 / 3600;
    lastCheckin.type = "check-out";
    await lastCheckin.save();

    return res.status(200).json({
      status: "success",
      message: "Check-out done",
      data: lastCheckin,
    });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.getAllAttendanceRecordsForEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const attendanceRecords = await Attendance.find({ employee: id })
      .populate("employee")
      .populate("organization")
      .sort({ checkinTime: -1 });

    if (!attendanceRecords.length) {
      return res.status(404).json({
        status: "fail",
        message: "No attendance records found for this employee",
      });
    }

    return res.status(200).json({
      status: "success",
      result: attendanceRecords.length,
      data: attendanceRecords,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getTodayAttendanceForEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const attendanceRecords = await Attendance.find({
      employee: id,
      checkinTime: { $gte: startOfDay, $lte: endOfDay },
    })
      .sort({ checkinTime: -1 })
      .populate("employee")
      .populate("organization");

    if (!attendanceRecords.length) {
      return res.status(404).json({
        status: "fail",
        message: "No attendance records found for today",
      });
    }

    return res.status(200).json({
      status: "success",
      data: attendanceRecords,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getAllAttendanceRecords = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find()
      .populate("employee")
      .populate("organization")
      .sort({ checkinTime: -1 });

    if (!attendanceRecords.length) {
      return res.status(404).json({
        status: "fail",
        message: "No attendance records found",
      });
    }

    return res.status(200).json({
      status: "success",
      result: attendanceRecords.length,
      data: attendanceRecords,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.checkIfWithinRange = async (req, res) => {
  const { lat, lng, employeeId } = req.query;

  try {
    const { distanceInMeters } = await check(employeeId, lat, lng);

    const isWithinRange = distanceInMeters <= 100 ? true : false;

    return res.status(200).json({
      status: "success",
      isWithinRange,
      message: isWithinRange
        ? "Employee is within valid check-in range"
        : "Employee is outside the valid check-in range",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
