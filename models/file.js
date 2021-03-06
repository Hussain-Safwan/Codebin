var mongoose = require('mongoose');

// File Schema
var FileModel = mongoose.Schema({
    filename: {
        type: String
    },
    fileext: {
        type: String
    },
    filesize: {
        type: String
    },
    fileContent: {
        type: String
    },
    owner: {
        type: String
    },
    ownerName: {
        type: String
    },
    tags: {
        type: [String]
    },
    trigger: {
        type: String,
        default: 'letter'
    },
    parent: {
        type: String
    },
    parentName: {
        type: String
    },
    origin: {
        type: String
    },
    createdAt: {
        type: String,
        default: new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()
    }
});

var FileModel = module.exports = mongoose.model('File', FileModel);