const express = require("express");
const router = express.Router();
const controller = require('../controllers/posts');
const { getLogin, getRegister, postLogin, postRegister, getLogout } = require('../controllers/auth')
const dir = require('../models/directory')

//Auth
router.get('/login', getLogin)
router.get('/register', getRegister)
router.post('/login', postLogin)
router.post('/register', postRegister)
router.get('/logout', getLogout)

//Posts
router.get('/editor', controller.get_editor);
router.get('/codeview/:id', controller.codeview);
router.get('/directory/:id', controller.directory)
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

//
router.get('/getdirectories', async(req, res) => {
    const directories = await dir.find({ owner: req.user._id })
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