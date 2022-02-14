/**
 * Import NPM modules
 *
 * import express and dotenv for environment variables to configure the app
 */
const express = require("express");
csrf = require("csurf");
require("dotenv").config();

//! Import local modules
// import the routes
const apiRoutes = require("./routes/api.route");
const authRoutes = require("./routes/auth.route");

// import the middleware/utilities
const { isAuthenticated } = require("./utils/auth");
const mongodbConnection = require("./utils/mongodbConnection");
const clientSession = require("./utils/sessionMiddleware"); // create sessions and cookies
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

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    clientSession.cookie.secure = true // serve secure cookies
}

app.use(clientSession);
app.use(csrf({ cookie: true }));

app.use("/api", isAuthenticated,rateLimit, apiRoutes);
app.use("/auth",rateLimit, authRoutes);

//set to render dynamic javascript files
//app.set("view engine", "ejs");

// start listening to the port specified(3000 by default)
app.listen(port, () =>
  console.log("> Server is up and running on port : " + port)
);
