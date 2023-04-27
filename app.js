const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
require('dotenv').config();
const bodyParser = require("body-parser");
const { mainRoutes } = require("./Routes/index");
const cors = require("cors");


console.log(process.env.MONGODB_URI);


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));


  app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Getting Request
app.get('/', (req, res) => {
 
    // Sending the response
    res.send('Hello World!')

    // Ending the response
    res.end()
})

// app.use("/api/auth", authRoute);
app.use("/onlineseller", mainRoutes);

// mongoose.connection.on('connected',()=>{
//     console.log('connected to mongo yeahhh',process.env.MOGOURI)
// })
// mongoose.connection.on('error',(err)=>{
//     console.log('error',err)
// })

app.get('/users', async (req, res) => {
  res.json({ message : "Users Hello"});
});



app.listen(PORT,()=>{
    console.log('server running on ',PORT)
})