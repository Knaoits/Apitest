const mongoose = require("mongoose");

const Products = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
    },
    seller_id : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Seller._id", 
    },
    qty: {
        type: Number,
    },
})


const Buyer = new mongoose.Schema(
    {
        username : {
            type: String,
            required: true  
        },
        password : {
            type: String,
            required: true
        },
        mobile_no : {
            type : Number,
            required: true
        },
        email : {
            type : String,
            required: true
        },
        address : {
            type : String,
        },
        status : {
            type : String,
            default : "unblocked"
        },
        cart : {
            type : [Products],
            default : []
        }

    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("Buyer", Buyer);
