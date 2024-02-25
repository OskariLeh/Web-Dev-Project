var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const {body, validationResult } = require("express-validator");
const User = require("../models/User");
const validateToken = require("../auth/validateToken.js")
const jwt = require("jsonwebtoken");
const multer = require("multer")
const storage = multer.memoryStorage()
const upload = multer({storage})

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
                bio: "",
                likes: []
              })
              .then((ok) => {
                return res.json({success: true});
              }
            );
          });
        });
      }
    });
});

// Handles logging in to an account
router.post('/login', 
  upload.none(),
  (req, res, next) => {
    User.findOne({email: req.body.email})
    .then((user) =>{
    if(!user) {
      return res.status(403).json({message: "Login failed :("});
    } else {
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch) {
          const jwtPayload = {
            id: user._id,
            username: user.username,
            email: user.email
          }
          jwt.sign(
            jwtPayload,
            process.env.SECRET,
            {
              expiresIn: 500
            },
            (err, token) => {
              res.json({success: true, token});
            }
          );
        } else {
          return res.status(403).json({message: "Incorrect password :("});
        }
      })
    }

    })

});

// Returns the username and bio of the logged in profile
router.post("/get/profile", (req, res, next) => {
  const email = jwt.decode(req.body.token).email
  
  User.findOne({email: email})
  .then((user) => {
    if (!user) {
      return res.status(403).json({message: "Could not find the user"});
    } else {
      let profile = {
        username: user.username,
        bio: user.bio
      }
      return res.status(200).json(profile)
    }
  })
})

// Makes changes to the user data in the MongoDB database
router.post("/update/profile", (req, res, next) => {
  const email = jwt.decode(req.body.token).email

  
  User.findOne({email: email})
  .then((user) => {
    if (!user) {
      return res.status(403).json({message: "Could not find the user"});
    } else {
      user.bio = req.body.bio
      user.save()
      return res.status(200).json({success: true})
    }
  })
})

module.exports = router;
