const express = require("express");

const customerController = require("./../Controllers/customerController");
const { route } = require("./userRoute");

const router = express.Router();

router.route("/requestride").post(customerController.requestRide);
router.route("/getalloffers").get(customerController.getAllOffers);
router.route("/acceptoffer").post(customerController.AcceptOffer);

module.exports = router;
