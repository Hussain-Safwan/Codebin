const express = require("express");
const router = express.Router();
const fs = require("fs");
const readline = require("readline");
const request = require("request");

module.exports.get_editor = (req, res) => {
  return res.render("editor", {
    previousCode: "//Codebin Editor",
    run_result: ""
  });
};

module.exports.codeview = (req, res) => {
  return res.render("codeview");
}

module.exports.run_code = (req, res) => {
  const source_code = req.body.source_code;
  const Language = req.body.language;
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
        const err = "SyntaxError";
        return res.render("editor", {
          previousCode: source_code,
          run_result: err
        });
      } else {
        return res.render("editor", {
          previousCode: source_code,
          run_result: output
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports.readFile = (req, res) => {
  const fileContent = req.body.fileContent;
  console.log(fileContent);
  return res.render('codeview', {
    source_code: fileContent
  });
};

module.exports.downloadFile = (req, res) => {
  const data = "Learning how to write in a file."
      fs.writeFile('Output.txt', data, (err) => { 
          if (err) throw err; 
      })
  res.redirect('back');
}