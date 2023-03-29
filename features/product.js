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

        productImg: { 
            type: Array, 
            required: true 
        },

        categories: { 
            type: Array
        },

        size: { 
            type: String
        },

        color: { 
            type: Array
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





const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../shared/verifyToken");

const router = require("express").Router();

//CREATE

router.post("/createProduct", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    console.log('invoke here');
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    console.log('invoke here2222344');
    res.status(500).json(err);
  }
});

//GET ALL PRODUCTS
router.get("/allProducts", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
