var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const {body, validationResult } = require("express-validator");
const User = require("../models/User");
const Message = require("../models/Message");
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

// Handles logging in to an account uses bcrypt to compare passwords and generates jsonwebtoken
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
              expiresIn: 2000
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
router.post("/get/profile", validateToken, (req, res, next) => {
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

// Changes bio in the database
router.post("/update/profile", validateToken,(req, res, next) => {
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

// Adds a like to the profile when user likes/dislikes someone
router.post("/like", validateToken, (req, res, next) => {
  const email = jwt.decode(req.body.token).email
  
  User.findOne({email: email})
  .then((user) => {
    if (!user) {
      return res.status(403).json({message: "Could not find the user"});
    } else {
      let like = {
        user: req.body.id,
        like: req.body.like
      }
      user.likes.push(like)
      user.save()
      return res.status(200).json({success: true})
    }
  })
})

// Gets all profiles then filters out all that have been liked and returns the remaining users usernames and bios
router.post("/get/profiles", validateToken, (req, res, next) => {
  const email = jwt.decode(req.body.token).email
  let likes = []
  let profiles = []
  
  User.findOne({email: email})
  .then((user) => {
    if (!user) {
      return res.status(403).json({message: "Could not find the user"});
    } else {
      // get the user id from every like 
      user.likes.forEach(like => {
        likes.push(like.user)
      }); 
      // Get all users
      User.find({})
      .then(users => {
        users.forEach(user => {
          // Finds the users which he current user has not liked/disliked yet
          if (!likes.includes(user._id.toString()) && user.email != email){
            let profile = {
              id: user._id,
              username: user.username,
              bio: user.bio
            }
            profiles.push(profile)
            
          }
        });
        return res.status(200).json({profiles: profiles})
      })
    }
  })
})

// Finds people that have liked eachother and returns them
router.post("/get/matches", validateToken, (req, res, next) => {
  const email = jwt.decode(req.body.token).email
  let matches = []
  
  User.findOne({email: email})
  .then((user) => {
    if (!user) {
      return res.status(403).json({message: "Could not find the user"});
    } else {
      // Get the logged in user and check which accounts that user liked 
      user.likes.forEach((like, index) => {
        if (like.like) {
          User.findById(like.user)
          .then(user2 => {
            // Check if we have a match
            if (user2.likes.some(like => like.user === user._id.toString() && like.like === true)) {
              let match = {
                id: user2._id,
                username: user2.username,
                bio: user2.username
              }
              matches.push(match)
            }
            if (index === user.likes.length - 1) {
              return res.status(200).json({matches: matches})
            } 
          })
        }
      }); 
    }
  })
})

// Saves a message sent by current user to the database
router.post("/send/message", validateToken, (req, res, next) => {
  const email = jwt.decode(req.body.token).email
  
  User.findOne({email: email})
  .then((user) => {
    if (!user) {
      return res.status(403).json({message: "Could not find the user"});
    } else {
      Message.create({
        sender: user.id,
        receiver: req.body.receiver.id,
        content: req.body.content,
        time: Date.now()
      })
      .then((ok) => {
        return res.status(200).json({success: true})
      })
    }
  })
})

// Gets messages sent by two users to eachother
router.post("/list/messages", validateToken, (req, res, next) => {
  const email = jwt.decode(req.body.token).email
  console.log(req.body.receiver)
  User.findOne({email: email})
  .then((user) => {
    if (!user) {
      return res.status(403).json({message: "Could not find the user"});
    } else {
      Message.find({sender: user._id.toString(), receiver: req.body.receiver.id})
      .then(sentMessages => {
        Message.find({sender: req.body.receiver.id, receiver: user._id.toString()})
        .then(receivedMessages => {
          
          return res.status(200).json({sentMessages: sentMessages, receivedMessages: receivedMessages})
        })
      })
    }
  })
})


module.exports = router;
