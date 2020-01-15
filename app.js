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
app.get("/editor", (req, res) => {
  return res.render("editor", {
    previousCode: '//Codebin Editor',
    run_result: ''
  });
});

app.post("/run", (req, res) => {
  const source_code = req.body.source_code;
  const Language = req.body.language;
  console.log("config: ", Language);
  var hackerEarth = require("hackerearth-node");

  var hackerEarth = new hackerEarth("392c70615809060562e8fa455c34aa3c57753a94");
  const clienSecret = "392c70615809060562e8fa455c34aa3c57753a94";
  var config = {};
  config.time_limit = 5;
  config.memory_limit = 323244;
  config.source = source_code;
  config.input = "";
  config.language = Language;
  let output;
  hackerEarth
    .run(config)
    .then(result => {
      let parsedResult = JSON.parse(result);
      output = parsedResult.run_status["output"];
      if (parsedResult.compile_status != "OK") {
        console.log("syntax error");
        const err = "SyntaxError";
        return res.render("editor", {
          previousCode: source_code,
          run_result: err
        });
      } else {
        console.log(output);
        return res.render("editor", {
          previousCode: source_code,
          run_result: output
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, function() {
  console.log("Listening to ", PORT);
});

// AIzaSyD8LUZ2FcwHr00X9lBGFAw9pwrBVkLiJXg google api key
