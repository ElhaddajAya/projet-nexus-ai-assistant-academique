const mongoose = require('mongoose');

async function connectDB()
{
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI is not defined in environment variables!');

    await mongoose.connect(uri);
    console.log("✅ MongoDb connected!");
}

module.exports = connectDB;