const Organization = require("../models/organizationModel");

exports.createOrganization = async (req, res) => {
  try {
    const { name, location } = req.body;
    const newOrganization = await Organization.create({
      name,
      location,
    });

    return res.status(201).json({
      status: "success",
      message: "Organization created",
      organization: newOrganization,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find();
    return res
      .status(200)
      .json({ status: "success", result: organizations.length, organizations });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getOrganizationById = async (req, res) => {
  const { id } = req.params;
  try {
    const organization = await Organization.findById(id);
    if (!organization)
      return res.status(404).json({ message: "Organization not found" });

    return res.status(200).json({ status: "success", organization });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.updateOrganization = async (req, res) => {
  const { id } = req.params;
  const { name, location } = req.body;
  try {
    const updatedOrganization = await Organization.findByIdAndUpdate(
      id,
      { name, location },
      { new: true }
    );
    if (!updatedOrganization)
      return res.status(404).json({ message: "Organization not found" });

    return res.status(200).json({
      status: "success",
      message: "Organization updated",
      organization: updatedOrganization,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.deleteOrganization = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrganization = await Organization.findByIdAndDelete(id);
    if (!deletedOrganization)
      return res.status(404).json({ message: "Organization not found" });

    return res.status(200).json({ message: "Organization deleted" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
