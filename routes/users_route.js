const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user_model");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/signup", async (request, response, next) => {
  let obj = await User.find({ email: request.body.email }).exec();

  console.log(obj.length + " ::::::::::::::::::::::::");
  if (obj.length) {
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

router.post("/login", (request, response, next) => {
  User.find({ email: request.body.email })
    .exec()
    .then((user) => {
      // array of user
      if (user.length < 1) {
        response.status(401).json({
          message: "Auth Failed",
        });
      }
      bcrypt.compare(request.body.password, user[0].password, (err, result) => {
        if (err) {
          response.status(500).json({
            message: err.message,
          });
        }
        if (result) {
          jwt.sign(
            {
              email: user[0].email,
              _id: user[0]._id,
            },
            process.env.secret_key,
            {
              expiresIn: "1h",
            },
            (err, token) => {
              if (err) {
                response.status(500).json({
                  message: "Server Error",
                });
              }
              response.status(200).json({
                message: "Auth sucessfull",
                token: token,
              });
            }
          );
        } else {
          response.status(401).json({
            message: "Auth Failed",
          });
        }
      });
    });
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
