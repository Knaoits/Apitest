const express = require('express');
// const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Connect to MongoDB database using Mongoose
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error(err));


//   app.get('/favicon.ico', (req, res) => {
//     res.sendFile(path.join(__dirname, 'favicon.ico'));
//   });



// Define routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port} ${process.env.MONGODB_URI}`);
});
