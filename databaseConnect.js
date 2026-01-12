const mongoose = require("mongoose");

// connect mongodb function
const connectToDatabase = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to Visitor MongoDB database successfully!!!!");
  } catch (error) {
    console.error("My MongoDB connection error:", error);
    process.exit(1);
  }
};


module.exports = connectToDatabase;
