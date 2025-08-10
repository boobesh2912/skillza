// This file is for connecting to our MongoDB database

// Import mongoose, which is the library we use to interact with MongoDB
const mongoose = require('mongoose');

// Import dotenv to use the secret variables from our .env file
const dotenv = require('dotenv');
dotenv.config(); // This loads the .env file variables

// This is an asynchronous function to connect to the database
const connectDB = async () => {
  try {
    // Try to connect to the database using the connection string from our .env file
    await mongoose.connect(process.env.MONGO_URI);

    // If the connection is successful, print a success message to the console
    console.log('MongoDB Connection Successful!');

  } catch (error) {
    // If there is an error during connection, print the error message
    console.error(`Error connecting to MongoDB: ${error.message}`);

    // Exit the application with a failure code
    process.exit(1);
  }
};

// Export the connectDB function so we can use it in other files (like server.js)
module.exports = connectDB;