// import mongoose for mongoDB
const mongoose = require("mongoose");
// import dotenv for environment variables to configure the app
require("dotenv").config();

// set connection string to mongoDB
const db = process.env.MONGODB_URI || "mongodb://localhost/contacts";
// connect to mongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: " + err.message);
  });