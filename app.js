/**
 * Import NPM modules
 *
 * import express and dotenv for environment variables to configure the app
 */
const express = require("express");
// import client side session package
const session = require("express-session");
// import server side session package
const MongoDBSession = require("connect-mongodb-session")(session);
require("dotenv").config();

//! Import local modules
// import the routes
const apiRoutes = require("./routes/api.route");
const authRoutes = require("./routes/auth.route");

// import the middleware/utilities
const { isAuthenticated } = require("./utils/auth");
const mongodbConnection = require("./utils/mongodbConnection");
const rateLimit = require("./utils/rateLimit");

//! initialize server
//create an instance of express
const app = express();
// set port as specified in the environment variables or to 3000 if not specified
const port = process.env.PORT || 3000;

//! Middleware
// recognize incoming request object as json during post and put requests
app.use(express.json());
// recognize incoming request object as strings or arrays during post and put requests
app.use(express.urlencoded({ extended: true }));

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
      console.error(err); 
  }

  console.log("Session Connected to MongoDB");
});

// Catch errors
store.on('error', function(error) {
  console.error(error);
});

const sessionOptions = {
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, //one week
      secure: false,
  },
  store: store,
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessionOptions.cookie.secure = true // serve secure cookies
}

const clientSession = session(sessionOptions);


console.log("session middleware is set");

app.use(clientSession);

app.use("/api", isAuthenticated ,rateLimit , apiRoutes);
app.use("/auth",rateLimit, authRoutes);

//set to render dynamic javascript files
//app.set("view engine", "ejs");

// start listening to the port specified(3000 by default)
app.listen(port, () =>
  console.log("> Server is up and running on port : " + port)
);
