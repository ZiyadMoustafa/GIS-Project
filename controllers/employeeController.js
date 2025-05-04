const Employee = require("../models/employeeModel");

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, organizationId } = req.body;
    const newEmployee = await Employee.create({
      name,
      email,
      organization: organizationId,
    });

    return res.status(201).json({
      status: "success",
      message: "Employee created",
      employee: newEmployee,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findById(id).populate("organization");
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    return res.status(200).json({ status: "success", employee });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate("organization");
    return res
      .status(200)
      .json({ status: "success", result: employees.length, employees });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  const { id } = req.params;

  const currentEmployee = await Employee.findById(id);
  if (!currentEmployee)
    return res.status(404).json({ message: "Employee not found" });

  let updatedEmployee;
  try {
    if (req.body.organizationId) {
      updatedEmployee = await Employee.findByIdAndUpdate(
        id,
        {
          name: req.body.name,
          email: req.body.email,
          organization: req.body.organizationId,
        },
        { new: true }
      );
    } else {
      updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, {
        new: true,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Employee updated",
      employee: updatedEmployee,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee)
      return res.status(404).json({ message: "Employee not found" });

    return res
      .status(200)
      .json({ status: "success", message: "Employee deleted" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
