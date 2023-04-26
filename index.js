const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { mainRoutes } = require("./Routes/index");
const port = 3004;
const cors = require("cors");

const dConnection =
    "mongodb+srv://admin:admin@cluster0.sshqcpg.mongodb.net/OnlineSeller";

    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
      };
mongoose
    .connect(dConnection, options)
    .then(() => {
        console.log("DB Connected!");
    })
    .catch((err) => {
        console.log("🚀 ~ file: index.js:24 ~ err:", err)
        throw new Error("Database credentials are invalid.");
    });

    // app.use(cors());
    
    // app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// Getting Request
app.get('/', (req, res) => {
 
    // Sending the response
    res.send('Hello World!')
    
    // Ending the response
    res.end()
})
app.use("/onlineseller", (req,res) => {
    res.json({ message : "Hello"})
});

// app.use("/api/auth", authRoute);



    
app.listen(port, () => {
    console.log("server started on", port);
});
