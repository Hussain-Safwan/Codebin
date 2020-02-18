const express = require("express");
const router = express.Router();
const axios = require('axios')
const net = require('net')
const controller = require('../controllers/posts');
const { getLogin, getRegister, postLogin, postRegister, getLogout } = require('../controllers/auth')
const { openCollab } = require('../collab')
const dir = require('../models/directory')
const sharedDir = require('../models/shared_directory')

//Auth
router.get('/login', getLogin)
router.get('/register', getRegister)
router.post('/login', postLogin)
router.post('/register', postRegister)
router.get('/logout', getLogout)

//Posts
router.get('/editor', controller.get_editor);
router.get('/get_user/:id', controller.get_user);
router.get('/codeview/:id', controller.codeview);
router.get('/directory/:id', controller.directory)
router.get('/shared_dir/:id', controller.shared_dir)
router.post('/search', controller.search)
router.post('/run', controller.run_code);
router.post('/readfile', controller.readFile);
router.post('/run_from_view', controller.run_from_view);
router.post('/inc_score', controller.inc_score);

//Create routes
router.post('/create_directory', controller.create_directory)
router.post('/create_shared_directory', controller.create_shared_directory);
router.post('/upload_file', controller.upload_file)
router.post('/new_paste', controller.new_paste)

router.post('/openCollab', openCollab)

//ajax routes
router.get('/getdirectories', async(req, res) => {
    const directories = await dir.find({ owner: req.user._id })
    const shared = await sharedDir.find()

    for (let i = 0; i < shared.length; i++) {
        const col = shared[i].collaborators
        if (col.includes(req.user.email) || shared[i].owner == req.user._id) {
            directories.push(shared[i])
        }
    }
    res.send(directories)
})

router.get('/get_image', async(req, res) => {
    if (req.user) {
        const id = req.user._id
        res.send(id)
    } else {
        res.send('none')
    }
})

module.exports = router;