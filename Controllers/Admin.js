const Admin = require("../Models/Admin");
const Buyer = require("../Models/Buyer");
const Order = require("../Models/Order");
const Product = require("../Models/Product");
const Report = require("../Models/Report");
const Seller = require("../Models/Seller");
const jwt = require("jsonwebtoken");

const secretKey = "onlineSeller";
const AdminLogin = async (req, res) => {
    try {
      const data = req.body;
      let response  = await Admin.findOne({ username : data?.username , password : data?.password })
      if(response){
        const token = jwt.sign({ username: data?.username }, secretKey);
        res.json({
          data: { admin_name: response.username,token : token, email: response.email },
          message: "Login Successfully" });
      }else{
        res.status(400).json({ message: "Invalid Credentials", data : response });
      }
    } catch(e) {
        res.status(400).json({ message: "Invalid Credentials" });
    }
  };

  const  sellerStatusChanged =  async (req, res) => {
    try {
        const data = req.body;
        await Seller.findOneAndUpdate(
            { _id: data?.id },
            { status : data?.status },
            { new: true }
        );
        res.json({ message: "Status Updated Successfully" });
      } catch(e) {
        res.status(400).json({ message: "Something went Wrong" });
      }
    }

  const buyerStatusChanged = async (req,res) => {
    try {
      const data = req.body;
      await Buyer.findOneAndUpdate(
          { _id: data?.id },
          { status : data?.status },
          { new: true }
      );
      res.json({ message: "Status Updated Successfully" });
    } catch(e) {
      res.status(400).json({ message: "Something went Wrong" });
    }
  }

const deleteSeller = async (req,res) => {
    try{
        const { id } = req.query;
        await Promise.all([
            Seller.deleteOne({ _id: id }),
            Product.deleteMany({ seller_id: id }),
            Order.deleteMany({ seller_id: id }),
            Report.deleteMany({ seller_id: id })
          ]);      
        res.json({ message: "Seller Deleted Successfully" });
    }catch(e) {
        res.status(400).json({ message: "Something went Wrong" });
    }
}

const deleteBuyer = async (req,res) => {
  try{
      const { id } = req.query;
      await Promise.all([
          Buyer.deleteOne({ _id: id }),
          Product.deleteMany({ buyer_id: id }),
          Order.deleteMany({ buyer_id: id }),
          Report.deleteMany({ buyer_id: id })
        ]);      
      res.json({ message: "Seller Deleted Successfully" });
  }catch(e) {
      res.status(400).json({ message: "Something went Wrong" });
  }
}


  module.exports = {
    AdminLogin,
    sellerStatusChanged,
    buyerStatusChanged,
    deleteSeller,
    deleteBuyer
  };
  
