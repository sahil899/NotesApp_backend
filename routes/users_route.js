const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user_model");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/signup", async (request, response, next) => {
  let obj = await User.find({ email: request.body.email }).exec();

  if (obj) {
    response.status(409).json({
      message: "email already registered",
    });
  } else {
    console.log("password" + request.body.password);
    bcrypt.hash(request.body.password, 10, (err, hash) => {
      if (err) {
        response.status(500).json({
          message: "encryption failed",
        });
      }

      let user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: request.body.name,
        email: request.body.email,
        password: hash,
      });

      user
        .save()
        .then((res) => {
          response.status(201).json({
            message: "user created",
          });
        })
        .catch((err) => {
          response.status(500).json({
            message: "server error",
          });
        });
    });
  }
});

router.post("/delete:userid", (request, response, next) => {
  let userid = request.params.userid;
  User.remove({ _id: userid })
    .exec()
    .then((res) => {
      response.status(200).json({
        message: "user deleted",
        res: res,
      });
    })
    .catch((err) => {
      response.status(500).json({
        message: "server error",
      });
    });
});

module.exports = router;
