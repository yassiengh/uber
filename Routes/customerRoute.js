const express = require("express");

const customerController = require("./../Controllers/customerController");
const authController = require("./../Controllers/authController");
const { route } = require("./userRoute");

const router = express.Router();

router
  .route("/requestride")
  .post(
    authController.isLoggedIn,
    authController.restrictTo("customer"),
    customerController.requestRide
  );
router
  .route("/getalloffers")
  .get(
    authController.isLoggedIn,
    authController.restrictTo("customer"),
    customerController.getAllOffers
  );
router
  .route("/acceptoffer")
  .post(
    authController.isLoggedIn,
    authController.restrictTo("customer"),
    customerController.AcceptOffer
  );
router
  .route("/finishtrip")
  .post(
    authController.isLoggedIn,
    authController.restrictTo("customer"),
    customerController.finishTrip
  );

module.exports = router;
