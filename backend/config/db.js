const mongoose = require('mongoose');

let cached = global._mongooseConnection;

const connectDB = async () => {
  if (cached && cached.readyState === 1) {
    return cached;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    cached = conn.connection;
    global._mongooseConnection = cached;
    return cached;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
