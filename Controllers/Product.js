const Order = require("../Models/Order");
const Product = require("../Models/Product");
const Report = require("../Models/Report");


const getCategory = async (req,res) => {
  try {
    const { id } = req?.query
    const categories = await Product.distinct('category', { seller_id: id });
    let arr  = []
    categories.map((ele,index) => {
      let obj = {}
      obj['key'] = index
      obj['label'] = ele
      obj['value'] = ele
      arr.push(obj)
    })
    res.status(200).json(arr);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

const manageReport = async (data,productData) => {
  let oldReportData = await Report.findOne({ product_id : productData?._id})
  if(oldReportData){
    await Report.findOneAndUpdate(
        { product_id : productData.product_id },
        {  stockQuantity: productData?.quantity , totalQuantity : productData?.quantity ,buyingAmount : productData?.quantity * productData?.buying_price  },
        { new: true }
    )
  }else{
    let Obj = {
      product_id : productData?._id,
      seller_id : productData?.seller_id,
      totalQuantity : productData?.quantity,
      stockQuantity : productData?.quantity,
      sellQuantity : 0,
      buyingAmount :  productData?.buying_price * productData?.quantity,
      sellingAmount : 0,
      totalMargin : 0,
    }
    await Report.create(Obj);  
  }
}

const addSingleData = async (data) => {
  let obj = {
    ...data,
    quantity : data?.quantity * ( data?.carat ? data?.carat  : 1 )
  }
  let productData = await Product.create(obj);  
  manageReport(data,productData)
};

const addProduct = async (req, res) => {
  try {
    const { id } = req.query;
    const data = req.body.map((ele) => ({ ...ele, seller_id: id }));
    await Promise.all(data.map(addSingleData));
    res.json({ message: "Data added successfully" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const getProductData = async (req, res) => {
  try {   
    const { id, current, skip, page,product, category } = req.query; 
    let data = []
    let total = 0
    if(page === "buyerApp"){
      const searchQuery = { quantity: { $gt: 0 } };
      if (product && product !== "undefined") {
        const regex = new RegExp(product, 'i'); // create a regular expression with the product search query
        searchQuery.product_name = regex;
      }
      if(String(id) !== String(undefined)){
        total = await Product.find({ seller_id : id,  ...searchQuery }).countDocuments()
        data = await Product.find({ seller_id : id ,  ...searchQuery }).skip(Number(skip)).limit(8).populate('seller_id');
        
      }else {
        total = await Product.find({...searchQuery}).countDocuments()
        data = await Product.find({...searchQuery}).skip(Number(skip)).limit(8).populate('seller_id');
      }
    }else{
      if (product || category) {
        const searchQuery = {};
        if (product) {
          const regex = new RegExp(product, 'i'); // create a regular expression with the product search query
          searchQuery.product_name = regex;
        }
        if (category) {
          searchQuery.category = category;
        }
        total = await Product.find({ seller_id: id, ...searchQuery }).countDocuments();
        data = await Product.find({ seller_id: id, ...searchQuery }).skip((current - 1) * 10).limit(10).sort({ createdAt: -1 });
      } else {
        total = await Product.find({ seller_id: id }).countDocuments();
        data = await Product.find({ seller_id: id }).skip((current - 1) * 10).limit(10).sort({ createdAt: -1 });
      }
      
    }
   
    res.json({ data : data, total : total });
  } catch(e) {
    res.status(400).json({ message: e });
  }
};

const deleteProductData = async (req,res) => {
  try{
    const { id } = req.query;
    await Product.deleteOne({ _id: id });
    await Report.deleteOne({ product_id : id });
    await Order.deleteOne({ product_id : id });
    res.json({ message: "Deleted Successfully" });
  }catch(e){
    res.status(400).json({ message: e });
  }
}

const editProductData = async (req,res) => {
  try{
    const { id } = req.query;
    const  data  =  req.body;
    let ProductData = await Product.findByIdAndUpdate(id, {
      $inc: { quantity: data?.quantity },
      $set: {
        product_name: data?.product_name,
        category: data?.category,
        buying_price: data?.buying_price,
        selling_price: data?.selling_price,
      },
    }, { new: true });    

    await Report.findOneAndUpdate({ product_id : ProductData?.id},
      {
        $inc: { 
          totalQuantity:  data.quantity,
          stockQuantity : data.quantity,
          buyingAmount : data?.buying_price * data.quantity,   
        }
      }
    )
    res.json({ message: "Product Updated Successfully" });
  }catch(e){
    res.status(400).json({ message: e });
  }
}

module.exports = {
  addProduct,
  getProductData,
  deleteProductData,
  editProductData,
  getCategory
};
