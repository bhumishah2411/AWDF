require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const app = express();

connectDB();

app.use(express.json());
app.use("/students", studentRoutes);
app.listen(process.env.PORT, () => {

    console.log(`Server Running on Port ${process.env.PORT}`);

});