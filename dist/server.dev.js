"use strict";

var express = require("express");

var mongoose = require("mongoose");

var morgan = require("morgan");

var bodyPaser = require("body-parser");

var dotenv = require("dotenv");

var roleRoutes = require("./routes/roleRoute");

var usersRoutes = require("./routes/usersRoute");

var masterRoutes = require("./routes/masterRoute");

var cors = require("cors");

var session = require('express-session');

var app = express();
dotenv.config();
app.use(cors());
app.use(morgan("dev"));
app.use(bodyPaser.urlencoded({
  extended: true
}));
app.use(bodyPaser.json());
app.use(session({
  secret: "techHelps",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}));
mongoose.connect("mongodb+srv://kartikmax1:kartikyadav@cluster0.gujnyuq.mongodb.net/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on("error", function (err) {
  console.log(err);
});
db.once("open", function () {
  console.log("Database Connected");
});
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("Backend is running on port ".concat(PORT));
});
app.use("/api/role", roleRoutes);
app.use("/api/master", masterRoutes);
app.use("/api/users", usersRoutes);