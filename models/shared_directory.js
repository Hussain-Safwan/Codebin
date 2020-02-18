var mongoose = require('mongoose');

// User Schema
var SharedDirectoryModel = mongoose.Schema({
    name: {
        type: String
    },
    owner: {
        type: String
    },
    ownerName: {
        type: String
    },
    collaborators: {
        type: [String]
    },
    createdAt: {
        name: Date,
        role: {
            type: Date,
            default: Date.now()
        }
    }
});

var SharedDirectoryModel = module.exports = mongoose.model('SharedDirectory', SharedDirectoryModel);