const express = require("express");
const req = require("express/lib/request");

const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  try {
    const useToken = request.headers.authorization.split(" ")[1];
    console.log(useToken);
    var decoded = jwt.verify(useToken, process.env.secret_key);
    console.log(decoded);
    request.user_data = decoded;
  } catch (error) {
    response.status(500).json({
      message: error,
    });
  }
  next();
};
