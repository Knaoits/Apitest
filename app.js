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
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
};
mongoose
    .connect(dConnection, options)
    .then(() => {
        console.log("DB Connected!");
    })
    .catch((err) => {
        throw new Error("Database credentials are invalid.");
    });

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Getting Request
// app.get('/', (req, res) => {
 
//     // Sending the response
//     res.send('Hello World!')

//     // Ending the response
//     res.end()
// })

// app.use("/api/auth", authRoute);
app.use("/", (req,res) =>{ 
    res.json({ message : "Welcome"})
});



    
app.listen(port, () => {
    console.log("server started on", port);
});
