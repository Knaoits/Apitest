const Seller = require("../Models/Seller");
const secretKey = "onlineSeller";
const jwt = require("jsonwebtoken");

const SellerLogin = async (req, res) => {
  const { username, password } = req.body;
  const response = await Seller.findOne({ username, password }).select(
    "seller_id status username email"
  );

  if (!response) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  if (response.status === "blocked") {
    return res
      .status(401)
      .json({ message: "You are blocked by the Admin, Contact Admin" });
  }
  const token = jwt.sign({ username: username }, secretKey);

  res.json({
    data: { seller_id: response._id, seller_name: response.username, email: response.email },
    token : token,
    message: "Login Successfully",
  });
};
const addSeller = async (req, res) => {
  try {
    const data = req.body;
    const sellerExists = await Seller.findOne({ username: data.username });

    if (sellerExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const seller = new Seller(data);
    await seller.save();
    res.json({ message: "Seller created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getSellers = async (req, res) => {
  try {
    const { current } = req.query;
    let data = await Seller.find();
    total = await Seller.find().countDocuments();
    data = await Seller.find().skip((current - 1) * 10).limit(10);
    res.json({ data,total });
  } catch (e) {
    res.status(400).json({ message: e });
  }
};

const fetchSellerDataById = async (req, res) => {
  try {
    const { id } = req.query;
    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ message: "Seller Not Found" });
    }
    res.json({ data: seller });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSeller = async (req, res) => {
  try {
    const { id } = req.query;
    const seller = await Seller.findByIdAndUpdate(id, req.body, { new: true });
    if (!seller) {
      return res.status(404).json({ message: "Seller Not Found" });
    }
    res.json({ data: seller });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = {
  SellerLogin,
  addSeller,
  getSellers,
  fetchSellerDataById,
  updateSeller
};
