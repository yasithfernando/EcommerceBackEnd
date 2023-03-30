
const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const cors = require("cors");


const authRoute = require('./features/Auth');
const userRoute = require('./features/user');
const productRoute = require("./features/product");

dotenv.config();

//Middleware
//Add these middleware to acces request body url encoded values
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/products", productRoute);


const port = process.env.PORT || 9000

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(port, console.log(`Database connection ready and server running on port ${port}`))
    })
    .catch((err) => {
        console.log(err.message)
    })