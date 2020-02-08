var mongoose = require('mongoose');

// User Schema
var DirectoryModel = mongoose.Schema({
    name: {
        type: String
    },
    visibility: {
        type: String
    },
    owner: {
        type: String
    },
    createdAt: {
        name: Date,
        role: {
            type: Date,
            default: Date.now()
        }
    }
});

var DirectoryModel = module.exports = mongoose.model('Directory', DirectoryModel);