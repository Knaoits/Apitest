const Order = require("../Models/Order");
const moment = require("moment");
const Product = require("../Models/Product");
const Report = require("../Models/Report");
const { removeProductFromCart } = require("./Buyer");
const Buyer = require("../Models/Buyer");


const addSingleOrder = async (data) => {
  try{
    const promises = data?.products?.map( async (ele) => {
      let productData = await Product.findOne({_id : ele?.product_id })
      let arr = []
      if(productData?.quantity < 0) {
        return res.status(404).json({ message: "Product Not Available" });
      } 
      if (productData) {
        await Product.updateOne({ _id : ele?.product_id },
          { quantity : productData?.quantity - ele?.quantity}
         )
        await Report.findOneAndUpdate(
          { product_id: ele?.product_id },
          { $inc: { inOrderQuantity: ele?.quantity, stockQuantity: -ele?.quantity } },
          { new: true }
        );    
        }
    })

      await Promise.all(promises) 
      
      const lastOrder = await Order.findOne().sort({_id: -1}).limit(1);
      const lastOrderId = lastOrder ? parseInt(lastOrder.orderId.substr(6)) : 0;
      const nextOrderId = "ORD" + (lastOrderId + 1).toString().padStart(6, '0');
      let order = new Order({...data, orderId: nextOrderId});
       await order.save()
    
    if(data?.cart_id){
      if(data?.cart_id === "All"){
        let promises = data?.products?.forEach(async (ele) => {
          await removeProductFromCart(ele?.product_id,data?.buyer_id)
        })
        await Promise.all(promises)
      }else{
        await removeProductFromCart(data?.products?.[0]?.product_id,data?.buyer_id)
      }
    }
    return true
  }catch(e){
    return false
  }
  
}
const addNewOrder = async (req,res) => {
  try{
    let data = req?.body
    const promises = [];
    data?.map((ele) => {
      promises.push(addSingleOrder(ele))
    })
    await Promise.all(promises)
    return res.status(200).json({ message: "Order Placed Successfully" });
  } catch(e) {
    return res.status(400).json({ message: "Error placing order" });
  }
}

const fetchOrders = async (req, res) => {
  try {   
    const { id, current, pageSize, status, orderId } = req.query; 
    let total = 0
    let data = []

    if (orderId || JSON.parse(status).length !== 0) {
      let searchQuery = {};
      if (orderId) {
        searchQuery = {orderId: { $regex : orderId }}
      }
      if (JSON.parse(status).length) {
        searchQuery.status = { $in: JSON.parse(status)};
      }
      total = await Order.find({ seller_id: id, ...searchQuery }).countDocuments();
      data = await Order.find({ seller_id: id, ...searchQuery }).skip((current - 1) * 10).limit(10).sort({ createdAt: -1 });
    } else {

      total = await Order.find({ seller_id : id }).countDocuments()
      data = await Order.find({ seller_id : id }).populate('product_id').skip((current - 1) * 10).limit(10).sort({ createdAt: -1 })
    }

    res.json({ data : data, total : total });
  } catch(e) {
    res.status(400).json({ message: e });
  }
};

const fetchOrdersById = async (req, res) => {
  try {   
    const { id, status } = req.query; 
    const statusArray = status.split(',');
    let data = []
    if(statusArray[0] === "undefined"){
      data = await Order.find({ buyer_id : id }).populate('products.product_id').populate('seller_id').sort({ createdAt : -1 })
    }else{
      data = await Order.find({ buyer_id : id, status: { $in: statusArray } }).populate('products.product_id').populate('seller_id').sort({ createdAt : -1 })
    }
    res.json({ data });
  } catch(e) {
    res.status(400).json({ message: e });
  }
};

const handleUpdateOrderStatus =  async (ele,quantityUpdate,reportUpdate) => {
  try{
        await Product.findOneAndUpdate(
          { _id: ele.product_id },
          quantityUpdate,
          { new: true }
        );
    
        await Report.findOneAndUpdate(
          { product_id: ele.product_id },
          reportUpdate,
          { new: true }
        );
        return ""
  }catch(e) {
   console.log("🚀 ~ file: Order.js:116 ~ handleUpdateOrderStatus ~ e:", e)

  }
}

const updateOrderStatus = async (req,res) => {
  try{
    const { id,status } = req.query; 
    const orderData = await Order.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true }
    );
    
    orderData?.products?.map((ele) => {

        let quantityUpdate = {};
        let reportUpdate = {};
    
        if (status === "rejected") {
          quantityUpdate = { $inc: { quantity: ele.quantity } };
          reportUpdate = {
            $inc: {
              stockQuantity: ele.quantity,
              inOrderQuantity: -ele.quantity,
            },
          };
        } else if (status === "delivered") {
          quantityUpdate = {};
          reportUpdate = {
            $inc: {
              sellQuantity: ele.quantity,
              inOrderQuantity: -ele.quantity,
              sellingAmount : ele?.amount,
              totalMargin : ele?.quantity * ele?.purchasePrice - ele?.quantity *  ele?.originalPrice
            },
          };
        }
        handleUpdateOrderStatus(ele,quantityUpdate,reportUpdate)
    })

    res.json({ message: "Updated" });
  }catch(e){
    res.status(400).json({ message: e });
  }
}

const getMonthlyData = async (req,res) => {
  try{
    const { id, month } = req.query 
    let orderData = await Order.find({ seller_id : id })
    let obj = {
      totalMargin : 0,
      totalSellAmount : 0,
      totalCost : 0,
      order_delivered : 0,
      order_rejected : 0,
      order_pending : 0
    }
    let TotalBuyer = await Buyer.find({ seller_id : id}).countDocuments()
    orderData.map((ele) => {
      if(Number(moment(ele?.date).format('M')) === Number(month)){
        {
          ele?.products?.map((product) => {
            if(ele.status === 'delivered'){
              obj['totalMargin']  = obj['totalMargin'] + product?.purchasePrice * product?.quantity - product?.originalPrice * product?.quantity
              obj['totalCost'] = obj['totalCost'] + product?.originalPrice * product?.quantity  
            }
          })
        }
        if(ele?.status === 'delivered') obj['totalSellAmount'] =  obj['totalSellAmount'] + ele?.totalAmount
        if(ele?.status === 'rejected') obj['order_rejected'] = obj['order_rejected'] + 1
        if(ele?.status === 'pending') obj['order_pending'] = obj['order_pending'] + 1
        if(ele?.status === 'delivered') obj['order_delivered'] = obj['order_delivered'] + 1
      }
    })
    obj['buyers'] = TotalBuyer
    res.json({ data: obj });

  }catch(e){
    res.status(400).json({ message: e });
  }
}

const fetchDailyOrder = async (req,res) => {
  try{
    const { id, date } = req.query 
    let orderData = await Order.find({ seller_id : id })
    let obj = {
      orders_added : 0,
      order_delivered : 0,
      order_rejected : 0,
      totalMargin : 0,
      totalSellAmount : 0,
      totalCost : 0,  
      order_pending : 0
    }
    orderData.forEach((ele) => {
      if (String(moment(ele?.updatedAt).format().slice(0, 10)) === String(date.slice(0, 10))) {
        ele?.products?.map((item) => {
          if(ele?.status === 'delivered'){
            obj.totalMargin = obj.totalMargin +  item?.purchasePrice * item?.quantity - item?.originalPrice * item?.quantity 
            obj.totalCost += item?.originalPrice * item?.quantity
          }
        })
        if (ele?.status === "delivered") {
          obj.order_delivered += 1
          obj.totalSellAmount += ele?.totalAmount
        } else if (ele?.status === "rejected") {
          obj.order_rejected += 1
        } else if (ele?.status === 'pending'){
          obj.order_pending += 1
        }
      }
    })
    res.json({ data: obj });
  }catch(e){
    res.status(400).json({ message: e });
  }
}

module.exports = {
    addNewOrder,
    fetchOrders,
    updateOrderStatus,
    fetchOrdersById,
    getMonthlyData,
    fetchDailyOrder
};
