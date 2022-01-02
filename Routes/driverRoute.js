const express = require("express");

const driverController = require("./../Controllers/driverController");

const router = express.Router();

router.route("/getridesinfavarea").get(driverController.getAllridesInFavArea);

router.route("/offerprice").post(driverController.offerPrice);

router.route("/arrived").post(driverController.Arrived);

router.route("/finishtrip").post(driverController.finishTrip);

module.exports = router;
