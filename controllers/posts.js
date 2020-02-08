const express = require("express");
const router = express.Router();
const fs = require("fs");
const readline = require("readline");
const request = require("request");
const nodemailer = require('nodemailer');

const DirectoryModel = require('../models/directory')
const FileModel = require('../models/file')

module.exports.get_editor = (req, res) => {
    return res.render("editor", {
        previousCode: "//Codebin Editor",
        run_result: ""
    });
};

module.exports.codeview = async(req, res) => {
    const id = req.params.id
        // console.log('id: ', id)
    const code = await FileModel.findOne({ _id: id })
    return res.render("codeview", {
        source_code: code,
        run_result: " "
    });
};

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
    return res.render("codeview", {
        source_code: fileContent,
        run_result: " "
    });
};

module.exports.run_from_view = (req, res) => {
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
                return res.render("codeview", {
                    source_code: source_code,
                    run_result: err
                });
            } else {
                return res.render("codeview", {
                    source_code: source_code,
                    run_result: output
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
};

module.exports.inc_score = (req, res) => {
    const score = req.body.score;
};

module.exports.create_directory = async(req, res) => {
    const {
        name,
        visibility
    } = req.body
    console.log(req.body)
    const owner = req.user._id
    const newDirectory = await new DirectoryModel({
        name,
        visibility,
        owner
    }).save()

    console.log('saved')
    res.redirect('back')
}

module.exports.create_shared_directory = (req, res) => {
    const folderName = req.body.folderName;
    const reciepents = req.body.recipents;
    for (let i = 0; i < 2; i++) {
        let rec = reciepents[i].trim();
        sendMail(rec);
    }
    return res.redirect('back');
};

function sendMail(rec) {
    var Transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "safwan.du16@gmail.com",
            pass: "home761049997"
        }
    });

    var mailOptions;
    let sender = "admin@badblogger.com";
    mailOptions = {
        from: sender,
        to: rec,
        subject: "Shared directory invite",
        html: `<strong>Hussain Md Safwan</strong> has created a shared directory and added you as collaborator.<br> Click <a href="#">here</a> to access the directory.<br><br> Good day!`
    };
    console.log(mailOptions);

    Transport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response);
        }
    });
}

module.exports.upload_file = async(req, res) => {
    const {
        filename,
        fileext,
        filesize,
        fileContent,
        parent
    } = req.body
    const origin = 'file'
    const owner = req.user._id
    newFile = await new FileModel({
        filename,
        fileext,
        filesize,
        fileContent,
        owner,
        parent,
        origin
    }).save()

    console.log('file saved')
    res.redirect('/')
}

module.exports.new_paste = async(req, res) => {
    const fileext = req.body.language
    const filename = req.body.name + '.' + fileext
    const fileContent = req.body.fileContent
    const origin = 'paste'

    const newFile = await new FileModel({
        filename,
        fileext,
        fileContent,
        origin
    }).save()

    res.redirect('/')
}

module.exports.search = (req, res) => {
    const phrase = req.body.search
    return res.render('search')
}

module.exports.directory = async(req, res) => {
    const id = req.params.id
    const files = await FileModel.find({ parent: id })
    res.render('directory_view', {
        file: files
    })
}