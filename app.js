const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const cors = require("cors");

require('dotenv').config();

app.use(cors());

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











// const PORT = 5000
// require('dotenv').config();
// const cors = require("cors");
// const { mainRoutes } = require('../../OnlineSeller-Backend/Routes');


// console.log(process.env.MONGODB_URI);


// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error(err));

// // mongoose.connection.on('connected',()=>{
// //     console.log('connected to mongo yeahhh',process.env.MOGOURI)
// // })
// // mongoose.connection.on('error',(err)=>{
// //     console.log('error',err)
// // })
// app.get('/', (req, res) => {
//   res.send('Hello, world!');
// });

// // app.use(cors());
// // app.use(bodyParser.urlencoded({ extended: true }));
// // app.use(bodyParser.json());


// app.get('/users', async (req, res) => {
//   res.json({ message : "Users Hello"});
// });

// app.post("/onlineseller", async (req,res) => {
//   res.json({ message : "Hello Onlines Seller"});

// });



// app.listen(PORT,()=>{
//     console.log('server running on ',PORT)
// })