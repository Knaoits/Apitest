const mongoose = require("mongoose");


const Report = new mongoose.Schema(
    {
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
        totalQuantity : {
            type : Number,
        },
        stockQuantity : {
            type : Number,
        },
        inOrderQuantity : {
            type : Number,
        },
        sellQuantity : {
            type : Number,
        },
        buyingAmount : {
            type : Number,
        },
        sellingAmount : {
            type : Number,
        },
        totalMargin : {
            type : Number,
        },

    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("Report", Report);
