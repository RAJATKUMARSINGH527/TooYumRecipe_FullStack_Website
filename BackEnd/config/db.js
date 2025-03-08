const mongoose=require('mongoose');
require('dotenv').config();

const connectToDB = async () => {
    try {
        // await mongoose.connect('mongodb://localhost:27017/TOOYUM_RECIPE_APP');
        await mongoose.connect(process.env.MONGO_URL)
        // console.log('Connected to MongoDB');
        console.log("Connected to MongoDB Atlas"); 
        
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = {connectToDB};