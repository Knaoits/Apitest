const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const cors = require("cors");
const bodyParser = require('body-parser');
const { mainRoutes } = require('./Routes');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
console.log(process.env.MONGODB_URI);


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

// mongoose.connection.on('connected',()=>{
//     console.log('connected to mongo yeahhh',process.env.MOGOURI)
// })
// mongoose.connection.on('error',(err)=>{
//     console.log('error',err)
// })

app.post("/onlineseller", async (req,res) => {
  res.json({ message : "Hello Onlines Seller"});

});

app.use("/onlineseller", mainRoutes);

app.listen(PORT,()=>{
    console.log('server running on ',PORT)
})
