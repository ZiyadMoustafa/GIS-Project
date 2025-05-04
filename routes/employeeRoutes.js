const express = require("express");
const employeeController = require("../controllers/employeeController");

const router = express.Router();

router.post("/createEmployee", employeeController.createEmployee);

router.get("/getEmployeeById/:id", employeeController.getEmployeeById);

router.get("/getAllEmployees", employeeController.getAllEmployees);

router.patch("/updateEmployee/:id", employeeController.updateEmployee);

router.delete("/deleteEmployee/:id", employeeController.deleteEmployee);

module.exports = router;
