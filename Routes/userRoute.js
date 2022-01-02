const express = require("express");

const userController = require("./../Controllers/userController");

const router = express.Router();

router.route("/signup").post(userController.signup);

router.route("/login").post(userController.login);

// router
//   .route("/:id")
//   .get()
//   .patch()
//   .delete();

module.exports = router;
