const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const axios = require("axios")

const {
  isLoggedIn,
  isNotLoggedIn,
  validationLogin,
  isTokenValid
} = require("../middleware/middleware");

router.post("/login", (req, res, next) => {
      console.log('req.body :>> ', req.body);
      const { client_id, client_secret } = req.body;

      const client_secretIsValid = client_id==='dare' && client_secret==='s3cr3t'

      if (client_secretIsValid) {

        axios.post("https://dare-nodejs-assessment.herokuapp.com/api/login",{client_id, client_secret})
        .then((response)=>{
          const user={client_id, client_secret, token:response.data.token}
          req.session.user=user;
          res.json({user})
        })
        .catch((err)=>{
          res.json(err)
        })
      } else {
        next(createError(401)); // Unathorized
      }
});

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    }

    res
      .status(204) //  No Content
      .send();
  });
});

module.exports = router;
