const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    /*password: CryptoJS.AES.encrypt(
      JSON.stringify(req.body.password),
      process.env.PASS_SEC
    ).toString(),*/
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }


  
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      userName: req.body.user_name,
    });

    !user && res.status(401).json("Wrong User Name");

    /* const hashedPassword = CryptoJS.AES.decrypt(
       user.password.toString(),
       process.env.PASS_SEC
     );
 
 
     const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);*/

    const inputPassword = req.body.password;
    const originalPassword = user.password;

    // console.log(originalPassword);
    //console.log(inputPassword);

    originalPassword !== inputPassword &&
      res.status(401).json("Wrong Password");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


module.exports = router;


/*
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Token = require('../utils/token');

router.post('/signup', async (req, res, next) => {
    try {
        passport.authenticate('signup', {session: false}, function (err, user, info) {

            if (err || !user) {

                if (err.code && err.code === 11000) {
                    return res.status(400).json({
                        isRegistered: false,
                        duplicate: Object.keys(err.keyValue),
                        message: `Duplicate value entered for ${Object.keys(
                            err.keyValue
                          )} field, please choose another value`
                    })
                }

                return res.status(500).json({
                    isRegistered: false,
                    message: 'Unable to register your account, Already have a account? try login',
                    info
                });
            }
            const {password, ...userInfo} = user.toObject()

            const payload = {id: user._id, email: user.email, role: user.role}

            const token = Token.createToken(payload)

            return res.json({
                isRegistered: false,
                userInfo,
                token
            })
    
    
        })(req, res, next);
    } catch (error) {
        res.status(500).json(error.message)
    }
});

module.exports = router;





// Import required modules
const express = require('express');
const passport = require('passport');
const Token = require('../utils/token');

// Create a router instance
const router = express.Router();

// Define the sign in route
router.post('/signin', async (req, res, next) => {
  passport.authenticate(
    'login',
    async (err, user, info) => {
      try {
        if (err || !user) {
          return res.status(401).json({ message: info?.message, code: info?.code });
        }

        req.login(user, { session: false }, async (error) => {
          if (error) {
            return res.status(500).json({ message: 'error login user' });
          }

          const { password, ...userInfo } = user._doc;

          const payload = { id: user._id, email: user.email, role: user.role };

          const token = Token.createToken(payload);

          return res.json({
            userInfo,
            token,
          });
        });
      } catch (error) {
        return res.status(401).json({ message: 'error login user' });
      }
    }
  )(req, res, next);
});

// Export the router instance
module.exports = router;


*/
