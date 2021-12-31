const express = require("express");

const userController = require("./../Controllers/userController");

const router = express.Router();

router.route("/signup").get().post(userController.signup);

// router
//   .route("/:id")
//   .get()
//   .patch()
//   .delete();

module.exports = router;
