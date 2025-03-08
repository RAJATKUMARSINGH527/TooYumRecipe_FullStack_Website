const express = require("express");
const { connectToDB } = require("./config/db");
const authRouter = require("./routes/authRoutes");
const recipeRouter = require("./routes/recipeRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());


app.use("/auth", authRouter);
app.use("/recipes", recipeRouter);




const PORT = process.env.PORT || 5000;

app.listen(PORT, async() =>{
    try{
        await connectToDB();
        console.log(`The Server is connected successfully at http://localhost:${PORT}`);
    }
    catch(error){
        console.error("Error connecting to MongoDB:", error);
    }
});