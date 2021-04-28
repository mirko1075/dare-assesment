const express = require("express");
const fs = require('fs')
const session = require("express-session");
const morgan = require("morgan")
const cookieParser = require("cookie-parser");
const cors = require("cors");





// EXPRESS SERVER INSTANCE
const app = express();

/* MIDDLEWARES*/
//LOGGER MIDDLEWARE
app.use(morgan('combined'));

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
