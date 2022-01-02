const express = require("express");

const userController = require("./../Controllers/userController");
const authController = require("./../Controllers/authController");
const ratingController = require("./../Controllers/ratingController");

const router = express.Router();

router.route("/signup").post(userController.signup);

router.route("/login").post(userController.login);

router.route("/rate").post(authController.isLoggedIn, ratingController.rate);
module.exports = router;
