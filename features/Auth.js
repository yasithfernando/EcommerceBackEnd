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

 


router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      userName: req.body.user_name,
    });

    if (!user) {
      return res.status(401).json("Wrong User Name");
    }

    const inputPassword = req.body.password;
    const originalPassword = user.password;

    if (originalPassword !== inputPassword) {
      return res.status(401).json("Wrong Password");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    return res.status(200).json({ ...others, accessToken });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;