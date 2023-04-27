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


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

app.use("/onlineseller", mainRoutes);

app.listen(PORT,()=>{
    console.log('server running on ',PORT)
})
