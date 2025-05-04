const express = require("express");
const organizationController = require("../controllers/organizationController");

const router = express.Router();

router.post("/createOrganization", organizationController.createOrganization);

router.get(
  "/getOrganizationById/:id",
  organizationController.getOrganizationById
);

router.get("/getAllOrganizations", organizationController.getAllOrganizations);

router.patch(
  "/updateOrganization/:id",
  organizationController.updateOrganization
);

router.delete(
  "/deleteOrganization/:id",
  organizationController.deleteOrganization
);

module.exports = router;
