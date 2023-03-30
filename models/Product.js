const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema(
    {
        title: {
            type: String, 
            required: true, 
            unique: true 
        },

        productBrand: {
            type: String,
            required: true
        },

        desc: { 
            type: String, 
            required: true
        },

        // productImg: { 
        //     type: Array, 
        //     required: true 
        // },

        categories: { 
            type: Array
        },

        size: { 
            type: String
        },

        price: { 
            type: Number,
            required: true
        },

        inStock: { 
            type: Boolean,
            default: false
        },
       
        skuNumber:{
            type: String,
            required: true
        },

        type : {
            type: String,
            required: true
        },

        mfgDate : {
            type: Date,
            required: true
        },

        ExpDate : {
            type: Date,
            required: true
        },

        discount : {
            type: String
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
