const mongoose = require("mongoose");


const Product = new mongoose.Schema(
    {
        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Seller",
        },
        product_name : {
            type: String,
            required : true,
        },
        category : {
            type: String,
        },
        buying_price : {
            type: Number,
        },
        selling_price : {
            type: Number,
        },
        carat : {
            type: Number,
        },
        quantity : {
            type: Number,
        },
        date: {
            type : Date,
        },
        description : {
            type : String
        },
        image: {
            type : Array,
        }   
    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("Product", Product);
