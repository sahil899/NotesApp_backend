const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan"); // its for logging the request
const bodyparser = require("body-parser");
const notesRoutes = require("./routes/notes_routes");
const userRoutes = require("./routes/users_route");
// app.use((request,response,next)=>{
//     response.status(200).json({
//         message:"It works with fun"
//     })
// }) // use will execute everytime basically use for middleware every request goes throw it

mongoose.connect(
  "mongodb+srv://dbUser2471:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0.8vrwi.mongodb.net/Noteapp?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//corsssite origin resource sharing
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*"); // we can also specify which page can have accesss
  response.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  ); // which kind of header want to accept

  // preflight method is options
  if (request.method === "OPTIONS") {
    response.header(
      "Access-Control-Allow-Methods",
      "PUT,PATCH,POST,DELETE",
      "GET"
    );
    response.status(200).json({});
  }
  next();
});

// routing module
app.use("/notes", notesRoutes);
app.use("/user", userRoutes);

app.use((request, response, next) => {
  const error = new Error("Error found");
  error.status = 404;
  next(error);
});

app.use((error, request, response, next) => {
  response.status(error.status || 500).json({
    // for showing the error
    message: error.message,
    "error ": "yes",
  });
});

module.exports = app;
