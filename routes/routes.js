const express = require("express");
const router = express.Router();
const controller = require('../controllers/posts');

router.get('/editor', controller.get_editor);
router.get('/codeview', controller.codeview);
router.post('/run', controller.run_code);
router.post('/downloadFile', controller.downloadFile);
router.post('/readfile', controller.readFile);

module.exports = router;
