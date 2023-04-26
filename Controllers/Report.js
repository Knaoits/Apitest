const Report = require("../Models/Report");
const Seller = require("../Models/Seller");
const Buyer = require("../Models/Buyer");
const Order = require("../Models/Order");
const Product = require("../Models/Product");

const fetchReport = async (req, res) => {
  try {
    let arr = [];
    let total =0
    const { id, current, product } = req.query;
    if (product === undefined) {
      total = await Report.find({ seller_id: id }).countDocuments();
      let data = await Report.find({ seller_id: id }).populate('product_id').skip((current - 1) * 10).limit(10)
      arr = data;
    } else {
      let list = [];
      let data = await Report.find({ seller_id: id }).populate('product_id')
      data?.map((ele) => {
        if ((ele?.product_id?.product_name?.toLowerCase()?.slice(0, (product?.length))) === product?.toLowerCase()) {
          arr.push(ele);  
        }
      })
    total = arr.length;
     list = arr.slice((current - 1) * 10, 10)
     arr = list;
    }
    res.json({ data: arr, total: total });
  } catch (e) {
    res.status(400).json({ message: e });
  }
};


const clearDatabase = async (req,res) => {
  try{
    await Report?.deleteMany()
    await Seller?.deleteMany()
    await Buyer?.deleteMany()
    await Order?.deleteMany()
    await Product?.deleteMany()
    res.json({ message : "clear" });

  }catch(e) {
    res.json({ message : e });
  }
}

module.exports = {
    fetchReport,
    clearDatabase
};
