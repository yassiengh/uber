const express = require("express");

const adminController = require("./../Controllers/adminController");

const router = express.Router();

router.route("/getallforms").get(adminController.GetAllForms);
router.route("/approveform").post(adminController.ApproveForm);

module.exports = router;
