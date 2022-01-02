const express = require("express");

const adminController = require("./../Controllers/adminController");
const discountController = require("./../Controllers/discountController");

const router = express.Router();

router.route("/getallforms").get(adminController.GetAllForms);
router.route("/approveform").post(adminController.ApproveForm);
router.route("/adddiscountarea").post(discountController.AddDiscountForArea);
router
  .route("/removediscountarea")
  .post(discountController.removeDiscountForArea);
router.route("/addholiday").post(discountController.AddHoliday);
router.route("/removeholiday").post(discountController.removeHoliday);

module.exports = router;
