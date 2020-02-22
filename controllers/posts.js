const express = require("express");
const router = express.Router();
const fs = require("fs");
const readline = require("readline");
const request = require("request");
const nodemailer = require("nodemailer");

const DirectoryModel = require("../models/directory");
const SharedDirectoryModel = require("../models/shared_directory");
const FileModel = require("../models/file");
const UserModel = require("../models/user");

module.exports.get_user = async(req, res) => {
    const id = req.params.id;
    const remoteUser = await UserModel.findOne({ _id: id });
    const remoteFiles = await FileModel.find({ owner: id });
    const remoteDirs = await DirectoryModel.find({ owner: id });
    res.render("dashboard", {
        user: remoteUser,
        dirs: remoteDirs,
        file: remoteFiles
    });
};

module.exports.get_editor = (req, res) => {
    if (req.user) {
        return res.render("editor", {
            previousCode: "//Codebin Editor",
            run_result: ""
        });
    } else {
        res.redirect("/use/login");
    }
};

module.exports.codeview = async(req, res) => {
    const id = req.params.id;
    const code = await FileModel.findOne({ _id: id });

    return res.render("codeview", {
        source_code: code,
        run_result: " "
    });
};

module.exports.run_code = (req, res) => {
    const source_code = req.body.fileContent;
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

module.exports.run_from_view = async(req, res) => {
    const source_code = req.body.source_code;
    const Language = req.body.language;
    var hackerEarth = require("hackerearth-node");

    langMap = new Map();
    langMap.set("cpp", "C++");
    langMap.set("java", "Java");
    langMap.set("py", "Python");

    const lang = langMap.get(Language);

    const source_id = req.body.source_id;
    const sourceObj = await FileModel.findOne({ _id: source_id });

    var hackerEarth = new hackerEarth("392c70615809060562e8fa455c34aa3c57753a94");
    const clienSecret = "392c70615809060562e8fa455c34aa3c57753a94";
    var config = {};
    config.time_limit = 5;
    config.memory_limit = 323244;
    config.source = source_code;
    config.input = "";
    config.language = lang;
    let output;
    hackerEarth
        .run(config)
        .then(result => {
            let parsedResult = JSON.parse(result);
            output = parsedResult.run_status["output"];
            if (parsedResult.compile_status != "OK") {
                const err = "SyntaxError";
                return res.render("codeview", {
                    source_code: sourceObj,
                    run_result: err
                });
            } else {
                console.log(output);
                return res.render("codeview", {
                    source_code: sourceObj,
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
    const { name, visibility } = req.body;
    console.log(req.body);
    const owner = req.user._id;
    const newDirectory = await new DirectoryModel({
        name,
        visibility,
        owner
    }).save();

    console.log("saved");
    res.redirect("back");
};

module.exports.create_shared_directory = async(req, res) => {
    if (!req.user) {
        res.redirect("/use/login");
    }
    const name = req.body.folderName;
    const collaborators = req.body.recipents;
    const owner = req.user._id;
    const ownerName = req.user.name;

    const newSharedDir = await new SharedDirectoryModel({
        name,
        collaborators,
        owner,
        ownerName
    }).save();

    const id = newSharedDir._id;

    for (let i = 0; i < 2; i++) {
        let rec = collaborators[i].trim();
        sendMail(rec, req, id);
    }
    return res.redirect("back");
};

function sendMail(rec, req, id) {
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
        html: `<strong>${req.user.name}</strong> has created a shared directory and added you as collaborator.<br> Click <a href="http://localhost:3003/use/shared_dir/${id}">here</a> to access the directory.<br><br> Good day!`
    };
    console.log(mailOptions);

    Transport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent");
        }
    });
}

module.exports.upload_file = async(req, res) => {
    if (!req.user) {
        res.redirect("/use/login");
    }
    const { filename, fileext, filesize, fileContent, parent, Tags } = req.body;
    const tags = Tags.split(" ");
    const origin = "file";
    const owner = req.user._id;
    const ownerName = req.user.name;
    newFile = await new FileModel({
        filename,
        fileext,
        filesize,
        fileContent,
        tags,
        owner,
        ownerName,
        parent,
        origin
    }).save();

    console.log("file saved");
    res.redirect("/");
};

function byteLength(str) {
    var s = str.length;
    for (var i = str.length - 1; i >= 0; i--) {
        var code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) s++;
        else if (code > 0x7ff && code <= 0xffff) s += 2;
        if (code >= 0xdc00 && code <= 0xdfff) i--; //trail surrogate
    }
    return s;
}

module.exports.new_paste = async(req, res) => {
    if (!req.user) {
        res.redirect("/use/login");
    }
    let fileext = req.body.language;
    const ownerName = req.user.name;
    const owner = req.user._id;
    const filename = req.body.name + "." + fileext;
    const fileContent = req.body.fileContent;
    const parent = req.body.parent;
    const filesize = Math.ceil(byteLength(fileContent) / 1000);
    const origin = "paste";
    const Tags = req.body.tags;
    const tags = Tags.split("#");

    langMap = new Map();
    langMap.set("c", "C");
    langMap.set("cpp", "C++");
    langMap.set("java", "Java");
    langMap.set("py", "Python");
    langMap.set("js", "Javascript");
    fileext = langMap.get(fileext);

    const newFile = await new FileModel({
        filename,
        fileext,
        fileContent,
        parent,
        ownerName,
        owner,
        filesize,
        origin,
        tags
    }).save();

    res.redirect("/use/editor");
};

function getTags(obj) {
    tags = obj.tags.split("#");
    return tags;
}

module.exports.search = async(req, res) => {
    const phrase = req.body.search.toLowerCase();
    let files = []
    if (phrase.includes('::')) {
        res = phrase.split('::')
        console.log(res[1])
        _files = await FileModel.find()
        for (let i = 0; i < _files.length; i++) {
            if (_files[i].ownerName.toLowerCase().includes(res[1])) {
                files.push(_files[i])
            }
        }
    } else {
        files = await FileModel.find();
    }

    const directories = await DirectoryModel.find();

    let filteredFiles = [];
    let filteredDirs = [];
    let allTags = new Array();

    for (let i = 0; i < files.length; i++) {
        if (files[i].filename.toLowerCase().includes(phrase)) {
            filteredFiles.push(files[i]);
        }
    }
    for (let i = 0; i < files.length; i++) {
        const tags = files[i].tags;
        for (let j = 0; j < tags.length; j++) {
            if (tags[j].includes(phrase) && !filteredFiles.includes(files[i])) {
                filteredFiles.push(files[i]);
            }
        }
    }

    for (let i = 0; i < directories.length; i++) {
        if (directories[i].name.toLowerCase().includes(phrase)) {
            filteredDirs.push(directories[i]);
        }
    }

    return res.render("search", {
        phrase,
        files: filteredFiles,
        directories: filteredDirs
    });
};

module.exports.search_lang = async(req, res) => {
    const choice = req.body.choice
    console.log(choice)
    const phrase = req.body.phrase.toLowerCase();
    const files = await FileModel.find({ fileext: choice })

    const directories = await DirectoryModel.find();

    let filteredFiles = [];
    let filteredDirs = [];
    let allTags = new Array();

    for (let i = 0; i < files.length; i++) {
        if (files[i].filename.toLowerCase().includes(phrase)) {
            filteredFiles.push(files[i]);
        }
    }
    for (let i = 0; i < files.length; i++) {
        const tags = files[i].tags;
        for (let j = 0; j < tags.length; j++) {
            if (tags[j].includes(phrase) && !filteredFiles.includes(files[i])) {
                filteredFiles.push(files[i]);
            }
        }
    }

    for (let i = 0; i < directories.length; i++) {
        if (directories[i].name.toLowerCase().includes(phrase)) {
            filteredDirs.push(directories[i]);
        }
    }
    console.log('rendered')
    return res.render("search", {
        phrase,
        files: filteredFiles,
        directories: filteredDirs
    });
}

module.exports.directory = async(req, res) => {
    const id = req.params.id;
    const dir = await DirectoryModel.findOne({ _id: id });
    const files = await FileModel.find({ parent: id });
    const dirname = dir.name;
    res.render("directory_view", {
        name: dirname,
        file: files
    });
};

module.exports.shared_dir = async(req, res) => {
    if (!req.user) {
        res.redirect("/use/login");
    }
    const id = req.params.id;
    const dir = await SharedDirectoryModel.findOne({ _id: id });
    const files = await FileModel.find({ parent: id });
    const dirname = dir.name;
    res.render("shared_directory_view", {
        name: dirname,
        file: files
    });
};