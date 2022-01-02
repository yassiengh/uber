const express = require("express");

const adminController = require("./../Controllers/adminController");
const discountController = require("./../Controllers/discountController");
const authController = require("./../Controllers/authController");

const router = express.Router();

router
  .route("/getallforms")
  .get(
    authController.isLoggedIn,
    authController.restrictTo("admin"),
    adminController.GetAllForms
  );
router
  .route("/approveform")
  .post(
    authController.isLoggedIn,
    authController.restrictTo("admin"),
    adminController.ApproveForm
  );
router
  .route("/adddiscountarea")
  .post(
    authController.isLoggedIn,
    authController.restrictTo("admin"),
    discountController.AddDiscountForArea
  );
router
  .route("/removediscountarea")
  .post(
    authController.isLoggedIn,
    authController.restrictTo("admin"),
    discountController.removeDiscountForArea
  );
router
  .route("/addholiday")
  .post(
    authController.isLoggedIn,
    authController.restrictTo("admin"),
    discountController.AddHoliday
  );
router
  .route("/removeholiday")
  .post(
    authController.isLoggedIn,
    authController.restrictTo("admin"),
    discountController.removeHoliday
  );

router
  .route("/getrideinfo")
  .get(
    authController.isLoggedIn,
    authController.restrictTo("admin"),
    adminController.getRideInfo
  );

module.exports = router;
