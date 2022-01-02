const express = require("express");

const driverController = require("./../Controllers/driverController");
const authController = require("./../Controllers/authController");

const router = express.Router();

router
  .route("/getridesinfavarea")
  .get(
    authController.isLoggedIn,
    authController.restrictTo("driver"),
    driverController.getAllridesInFavArea
  );

router
  .route("/offerprice")
  .post(
    authController.isLoggedIn,
    authController.restrictTo("driver"),
    driverController.offerPrice
  );

router
  .route("/arrived")
  .post(
    authController.isLoggedIn,
    authController.restrictTo("driver"),
    driverController.Arrived
  );

router
  .route("/finishtrip")
  .post(
    authController.isLoggedIn,
    authController.restrictTo("driver"),
    driverController.finishTrip
  );

module.exports = router;
