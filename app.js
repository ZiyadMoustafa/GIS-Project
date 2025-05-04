const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");

const employeeRoutes = require("./routes/employeeRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

dotenv.config({ path: "./config.env" });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(morgan("dev"));

// Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/attendance", attendanceRoutes);

// Connect to database
mongoose
  .connect("mongodb://0.0.0.0:27017/locationCheckin")
  .then(() => {
    console.log("Connected to database successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// Running Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
