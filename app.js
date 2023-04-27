const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
require('dotenv').config();


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


app.listen(PORT,()=>{
    console.log('server running on ',PORT)
})