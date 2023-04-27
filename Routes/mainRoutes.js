const express = require("express");
const router = express.Router();
const controller = require("../Controllers");

// seller Side Api's
router.post("/products", controller.Product.addProduct);
router.get("/products", controller.Product.getProductData);
router.delete("/products", controller.Product.deleteProductData);
router.put("/products", controller.Product.editProductData);
router.get("/products/category",controller.Product.getCategory)

router.post("/seller/login",controller.Seller.SellerLogin)
router.get("/seller/orders",controller.Order.fetchOrders)
router.put("/orderStatus",controller.Order.updateOrderStatus)
router.get("/seller/report",controller.Report.fetchReport)
router.get("/seller/byId",controller.Seller.fetchSellerDataById)
router.put("/seller/update",controller.Seller.updateSeller)
// admin Side Api's
router.post("/admin/login",controller.Admin.AdminLogin)
router.post("/seller/add",controller.Seller.addSeller)
router.put("/seller/status",controller.Admin.sellerStatusChanged)
router.put("/buyer/status",controller.Admin.buyerStatusChanged)
router.delete("/seller",controller.Admin.deleteSeller)
router.delete("/buyer",controller.Admin.deleteBuyer)
router.get("/admin/sellers",controller.Seller.getSellers)
router.get("/admin/buyers",controller.Buyer.getBuyers)

// buyer Application Api's
router.post("/buyer/add",controller.Buyer.addBuyer)
router.post("/buyer/login",controller.Buyer.BuyerLogin)
router.post("/buyer/order",controller.Order.addNewOrder)
router.get("/buyer/order",controller.Order.fetchOrdersById)
router.put("/buyer/update",controller.Buyer.updateBuyer)
router.get("/buyer/getbyId",controller.Buyer.getBuyerById)
router.get("/buyer/sellers",controller.Buyer.getSellers)

router.post("/buyer/cart",controller.Buyer.addToCart)
router.delete("/buyer/cart",controller.Buyer.removeFromCart)
router.get("/buyer/cart",controller.Buyer.getCartData)

router.get("/clearDatabase",controller.Report.clearDatabase)
router.get("/getMonthlyData",controller.Order.getMonthlyData)
router.get("/getDailyReport",controller.Order.fetchDailyOrder)
router.get("/protected", controller.Buyer.verifyToken);

module.exports = router;    