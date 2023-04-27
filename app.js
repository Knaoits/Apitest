const express = require('express')
const app = express()
const mongoose = require('mongoose');
const { mainRoutes } = require('../../OnlineSeller-Backend/Routes');
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
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/users', async (req, res) => {
  res.json({ message : "Users Hello"});
});

app.use("/onlineseller", mainRoutes);



app.listen(PORT,()=>{
    console.log('server running on ',PORT)
})