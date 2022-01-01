const express = require("express");
const session = require("express-session");

const userRouter = require("./Routes/userRoute");

const app = express();

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

//session
app.use(session({ secret: "idk", resave: false, saveUninitialized: false }));

// routes
app.use("/uber/users", userRouter);

module.exports = app;
