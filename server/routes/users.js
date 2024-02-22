var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const {body, validationResult } = require("express-validator");
const User = require("../models/User");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Post route for registering new user
// Checks that email is a valid email and password longer than 5
router.post('/register', 
  body("email").isEmail(),
  body("password").isLength({min: 5}),
  (req, res, next) => {
    console.log("Heippa")
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    User.findOne({email: req.body.email})
    .then((user) => {
      if(user){
        return res.status(403).json({email: "Email alredy used."});
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if(err) throw err;
            User.create(
              {
                email: req.body.email,
                username: req.body.username,
                password: hash,
                likes: []
              })
              .then((ok) => {
                return res.json({email: "Account created"});
              }
            );
          });
        });
      }
    });
});

module.exports = router;
