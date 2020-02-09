const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require('mongoose')
const bodyParser = require("body-parser");
const passport = require('passport')
var cookieParser = require("cookie-parser");
var session = require("express-session");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Session
app.use(
    session({
        secret: "secret_KEY",
        saveUninitialized: true,
        resave: true
    })
);
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

mongoose.connect('mongodb+srv://paws:safwan@cluster0-gvu5h.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true },
    () => console.log("atlas db connected")
);

const homeRoute = require('./routes/home')
app.use('/', homeRoute)

const routes = require('./routes/routes');
app.use('/use', routes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, function() {
    console.log("Listening to ", PORT);
});