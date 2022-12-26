const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const biketype = require("./routes/biketype");
const bikeRoutes = require("./routes/bikeRoutes");
const bikeCommentRoutes = require("./routes/bikeComment");
const globalErrorHandler = require("./utils/errorController");
const errorResponse = require("./utils/errorResponse");

app.use(express.json());
app.use("/api/v1/biketype", biketype);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/bike", bikeRoutes);
app.use("/api/v1/bike/comment", bikeCommentRoutes);

app.all("*", (req, res, next) => {
  next(new errorResponse(`cant find this url ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
