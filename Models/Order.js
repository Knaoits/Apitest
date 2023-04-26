const mongoose = require("mongoose");

const Products = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
    },
    originalPrice : {
        type : Number,
    },
    purchasePrice : {
        type : Number,
    },
    quantity : {
        type : Number,
        required: true 
    },
    amount : {
        type : Number,
    },
})

const Order = new mongoose.Schema(
    {
        products : {
            type : [Products],
            default : []
        }, 
        seller_id : {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Seller", 
        },
        buyer_id : {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Buyer._id", 
        },
        totalAmount : {
            type : Number,
        },
        buyer_name : {
            type : String,
            required: true  
        },
        mobile_no : {
            type : String
        },
        date: {
            type: Date,
        },  
        deliveredDate : {
            type : Date
        },
        orderId : {
            type : String
        },
        status : {
            type : String,
            enum: ['pending', 'delivered', 'rejected'],
            default: "pending"
        }

    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("Order", Order);
