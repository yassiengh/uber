const express = require("express");

const userRouter = require("./Routes/userRoute");

const app = express();

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// routes
app.use("/uber/users", userRouter);

module.exports = app;
