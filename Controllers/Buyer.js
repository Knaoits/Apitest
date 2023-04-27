const Buyer = require("../Models/Buyer");
const Product = require("../Models/Product");
const Seller = require("../Models/Seller");
const jwt = require("jsonwebtoken");

const secretKey = "onlineSeller";


const BuyerLogin = async (req, res) => {
  try {
      const data = req.body;
      let response  = await Buyer.findOne({ username : data?.username , password : data?.password })
      if(response){
        const token = jwt.sign({ username: data?.username }, secretKey);
        res.json({ data : response, token : token,  message: "Login Successfully" });
      }else{
        res.status(400).json({ message: "Invalid Credentials" });
      }
    } catch(e) {
      res.status(400).json({ message: "Invalid Credentials" });
    }
  };

  const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }
    try {
      const decoded = jwt.verify(token,secretKey);
      req.user = decoded;
      next();
      return res.status(200).json({ msg : "Valid Token"})
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };

  const addBuyer = async (req,res) => {
    try{
        const data = req.body
        let BuyerData = await Buyer.find()
        if(BuyerData){
          let flag = false;
          BuyerData.map((ele) => {
            if(ele?.username === data.username){
              flag = true;
            }
          })
          if(flag) {
            return res.status(400).json({ message: "Already Occupied Username" })
          }
        }
        let buyer = new Buyer(data)
        await buyer.save()
        return res.status(200).json({ message: "Buyer Created Successfully" });
    }catch(e){
        res.status(400).json({ message: e });
    }
  }

  const getBuyers = async (req,res) => {
    try{
      const { current } = req.query;
      let data = await Buyer.find();
      total = await Buyer.find().countDocuments();
      data = await Buyer.find().skip((current - 1) * 10).limit(10);
      res.json({ data, total });
    } catch (e) {
      res.status(400).json({ message: e });
    }
  }
  
  const addToCart = async (req, res) => {
    try {
      const { id } = req.query;
      const data = req.body;
      const buyer = await Buyer.findById(id);
      if (!buyer) return res.status(400).json({ message: "Invalid Account" });

      if (buyer?.cart?.length === 0) {
        buyer.cart.push(data);
      } else {
        const index = buyer.cart.findIndex(
          (item) => String(item.product_id) === String(data.product_id)
        );
  
        if (index === -1) {
          buyer.cart.push(data);
        } else {
          buyer.cart[index].qty += data.qty;
        }
      }
      await buyer.save();
      res.json({ message: "Added to cart successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error adding to cart" });
    }
  };

 const removeProductFromCart = async (product_Id , Id) => {
    let productId = product_Id;
    let id = Id
    const buyer = await Buyer.findById(id); 
    if (!buyer) return '' 
    const index = buyer.cart.findIndex((item) => String(item.product_id) === String(productId))
    if (index === -1) return ''
    buyer.cart.splice(index, 1);
    await buyer.save();
    return ''
  }

  const removeFromCart = async (req, res) => {
    try {
      const { id , productId} = req.query;
      if(productId !== "undefined"){
        const buyer = await Buyer.findById(id);  
        if (!buyer) return res.status(404).json({ message: "Invalid Account" });
        const index = buyer.cart.findIndex((item) => 
          String(item.product_id) === String(productId)
          );
        if (index === -1) return res.status(404).json({ message: "Item not found in cart" });
        buyer.cart.splice(index, 1);
        await buyer.save();

      }else{
        await Buyer.updateOne(
          { _id: id }, // specify the buyer ID here
          { $set: { cart: [] } }
       )
      }
      res.json({ message: "Removed from cart successfully" });
    } catch (error) {
      res.status(404).json({ message: "Error removing from cart" });
    }
  };
  
  const getCartData = async (req,res) => {
    try {
      const { id } = req.query      
      const buyer = await Buyer.findById(id);

      if (!buyer) return res.status(400).json({ message: "Invalid Account" });
  
      const productIds = buyer.cart.map(item => item.product_id);
      const quantities = buyer.cart.map(item => item.qty);
      const cart = buyer.cart.map(item => item._id);

      const products = await Product.find({ _id: { $in: productIds } }).populate("seller_id");
      const cartData = products.map((product, index) => {
        return {
          product: product,
          quantity: quantities[index],
          cart_id : cart[index],
          buyer : buyer?.username
        };
      });
      let arr = []
      cartData?.map((ele) => {
        let qty =  ele?.quantity > ele?.product?.quantity ? false : true
          let obj = {
            ...ele, available : qty
          }
        arr.push(obj)
      })

      res.json({ data: arr });
    } catch (error) {
      res.status(404).json({ message: "Error get from cart" });
    }
  };


  const updateBuyer = async (req,res) => {
    try{
      const { id } = req.query;
      const data = req.body;
      await Buyer.findByIdAndUpdate(id, data);
      res.json({ message : "Updated Successfully" });
    }catch(e){
      res.status(400).json({ message: e });
    }
  }

  const getBuyerById = async (req,res) => {
    try{
      const { id } = req.query; 
      let data = await Buyer.findById(id).select("username email mobile_no password")
      res.json({ data });
    }catch(e){
      res.status(400).json({ message: e });
    }
  }

  const getSellers = async (req,res) => {
    try{
      let arr = []
      arr = await Seller.find({ status : "unblocked"}).select(" _id username")
      arr.push({ _id : 'undefined' , username : "All" })
      let data = arr
      res.json({ data });
    }catch{
      res.status(400).json({ message: e });
    }
  }

  module.exports = {
    BuyerLogin,
    addBuyer,
    getBuyers,
    addToCart,
    removeFromCart,
    getCartData,
    removeProductFromCart,
    updateBuyer,
    getBuyerById,
    getSellers,
    verifyToken
  };
  