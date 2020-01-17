const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const bodyParser = require("body-parser");
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

app.get("/", (req, res) => {
  return res.render("dashboard");
});

const routes = require('./routes/routes');
app.use('/use', routes);

const PORT = process.env.PORT || 3007;
app.listen(PORT, function() {
  console.log("Listening to ", PORT);
});

// AIzaSyD8LUZ2FcwHr00X9lBGFAw9pwrBVkLiJXg google api key
