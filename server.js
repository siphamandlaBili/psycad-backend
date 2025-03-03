require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRoutes);


const startDatabase = async (uri)=>{
    const PORT =5001;
    try {
        await connectDB(uri);
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.log(error.message);
    }
}

startDatabase(process.env.MONGO_URI)

