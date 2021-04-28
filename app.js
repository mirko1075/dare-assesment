const express = require("express");
const fs = require('fs')
const path = require('path')
const session = require("express-session");
const logger = require("morgan")
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();


const authRouter = require("./routes/auth.route");
const apiRouter = require("./routes/api.route");

// EXPRESS SERVER INSTANCE
const app = express();

/* MIDDLEWARES*/
//LOGGER MIDDLEWARE
app.use(logger('combined'));

// SESSION MIDDLEWARE
app.use(
    session({
      secret: process.env.SECRET_SESSION,
      resave: true,
      saveUninitialized: true
    })
  );

// CORS MIDDLEWARE SETUP
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost"],
  })
);
app.use(logger("dev"));
app.use(express.urlencoded({
    extended: true
  }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ROUTER
app.use("/auth", authRouter);
app.use("/api", apiRouter);

app.use((req, res, next) => {
    console.log("No matching request :>> ");
    res.sendFile(__dirname + "/public/index.html");
  });
  
  // ERROR HANDLING
  app.use((req, res, next) => {
    console.log("404");
    res.status(404).json({ code: "not found" }); 
  });
  
  app.use((err, req, res, next) => {
    console.error("ERROR", req.method, req.path, err);
  
    if (!res.headersSent) {
      const statusError = err.status || "500";
      res.status(statusError).json(err);
    }
  });
  
  module.exports = app;
  