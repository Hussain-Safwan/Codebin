const router = require('express').Router()
const DirectoryModel = require('../models/directory')
const SharedDirectoryModel = require('../models/shared_directory')
const FileModel = require('../models/file')
const User = require('../models/user')

router.get('/', async(req, res) => {
    if (!req.user) {
        res.render('login')
        return
    }
    const directories = await DirectoryModel.find({ owner: req.user._id })
    const files = await FileModel.find({ owner: req.user._id })
    const shared = await SharedDirectoryModel.find()
    const myShared = []

    for (let i = 0; i < shared.length; i++) {
        const col = shared[i].collaborators
        if (col.includes(req.user.email) || shared[i].owner == req.user._id) {
            myShared.push(shared[i])
        }
    }

    res.render('dashboard', {
        user: req.user,
        dirs: directories,
        shared: myShared,
        file: files
    })

})

module.exports = router