const mongoose = require("mongoose");


const Seller = new mongoose.Schema(
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
            type: Number,
            required: true  
        },
        address : {
            type : String,
            // required : true
        },
        email : {
            type : String,
            required: true  
        },
        status : {
            type: String,
            default : "unblocked"
        }
    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("Seller", Seller);
