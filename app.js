const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { mainRoutes } = require("./Routes");
const PORT = 5000
const cors = require("cors");
require('dotenv').config();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Getting Request

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));
  
  app.get('/', (req, res) => {
   
        // Sending the response
        res.send('Hello World!')
  
        // Ending the response
        res.end()
    })
app.use("/onlineseller", mainRoutes);

app.listen(PORT,()=>{
    console.log('server running on ',PORT)
})
