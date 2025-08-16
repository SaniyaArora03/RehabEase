const mongoose=require("mongoose");
require("dotenv").config();

//connect to db
const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        } catch (error) {
            console.error(error.message);
        }}
module.exports=  connectDB;