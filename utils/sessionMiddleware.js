// import client side session package
const session = require("express-session");
// import server side session package
const MongoDBSession = require("connect-mongodb-session")(session);
// import dotenv for environment variables to configure the app
require("dotenv").config();

// secret key for session
const SECRET_KEY = process.env.SECRET_KEY;
// set connection string to mongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/contacts";

const store = new MongoDBSession({
    uri: MONGODB_URI,
    databaseName: "phone_book",
    collection: "sessions",
}, function(err) {
    if (err) {
        console.log(err); 
    }

    console.log("Session Connected to MongoDB");
});

const clientSession = session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store: store,
});

// Catch errors
store.on('error', function(error) {
    console.log(error);
});

console.log("session middleware is set");

module.exports = clientSession;