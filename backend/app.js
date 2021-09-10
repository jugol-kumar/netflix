// ILoveUou2

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connection Successfull"))
    .catch((err) => console.error(err));



app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.listen(8888, function (){
    console.log('server started')
})


