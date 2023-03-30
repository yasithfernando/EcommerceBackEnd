const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Get bcryptjs by 'npm i bcryptjs'
const bcrypt = require('bcryptjs');



//REGISTER
router.post("/register", async (req, res) => {
  const {username,email,password} = req.body

  if(!username || !email || !password){
    res.status(400).json({
      message: 'Please add all fields'
    })
  }

  //Check if user exists
  const userExists = await User.findOne({email})

  if(userExists){
      res.status(400).json({
        message: 'User Already Exists'
      })
  }

  //Hash the password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  //Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword
  })

  if(user){
    res.status(201).json({
        _id : user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
    })
  } else{
    res.status(400).json({
      message: 'Invalid user datta'
    })
  }


  // const newUser = new User({
  //   username: req.body.username,
  //   email: req.body.email,
  //   password: req.body.password,
  //   /*password: CryptoJS.AES.encrypt(
  //     JSON.stringify(req.body.password),
  //     process.env.PASS_SEC
  //   ).toString(),*/
  // });

  // try {
  //   const savedUser = await newUser.save();
  //   res.status(201).json(savedUser);
  // } catch (err) {
  //   res.status(500).json(err);
  // }


  
});

 


router.post("/login", async (req, res) => {

    const {username, password} = req.body

    if(!username || !password){
        res.status(400).json({
          message : 'Please enter username and password'
        })
    }

    //Check user email
    const user = await User.findOne({username})

    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id : user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id, user.isAdmin),
            message : 'Login Succesful!'
        })

    } else{
        res.status(400)
        throw new Error('Invalid Credentials')
    }


  // const {username, password} = req.body
  // try {
  //   const user = await User.findOne({username});

  //   if (!user) {
  //     return res.status(401).json("Wrong User Name");
  //   }

  //   console.log(password)
  //   console.log(user.password)

//     if (password !== user.password) {
//       return res.status(401).json("Wrong Password");
//     }

//     const accessToken = jwt.sign(
//       {
//         id: user._id,
//         isAdmin: user.isAdmin,
//       },
//       process.env.JWT_SEC,
//       { expiresIn: "3d" }
//     );

//     const { password, ...others } = user._doc;
//     return res.status(200).json({ ...others, accessToken });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json(err);
//   }
});

const generateToken = (id,isAdmin)=>{
  return jwt.sign(
        {
          id,
          isAdmin
        },
        process.env.JWT_SEC,
        { expiresIn: "3d" }
      );
}

module.exports = router;