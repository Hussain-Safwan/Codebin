const router = require('express').Router()
const DirectoryModel = require('../models/directory')
const FileModel = require('../models/file')
const User = require('../models/user')

router.get('/', async(req, res) => {
    if (!req.user) {
        res.render('login')
    }
    const directories = await DirectoryModel.find({ owner: req.user._id })
    const files = await FileModel.find()
    res.render('dashboard', {
        user: req.user,
        dirs: directories,
        file: files
    })
    res.send(directories)

})

module.exports = router