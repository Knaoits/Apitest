const mongoose = require("mongoose");


const Admin = new mongoose.Schema(
    {
        username : {
            type: String,
            required: true  
        },
        password : {
            type: String,
            required: true
        },
        email : {
            type :String,
        }
    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("Admin", Admin);
