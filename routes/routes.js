const express = require("express");
const router = express.Router();
const controller = require('../controllers/posts');

router.get('/editor', controller.get_editor);
router.get('/codeview', controller.codeview);
router.get('/directory', controller.directory)
router.post('/search', controller.search)
router.post('/run', controller.run_code);
router.post('/readfile', controller.readFile);
router.post('/run_from_view', controller.run_from_view);
router.post('/inc_score', controller.inc_score);
router.post('/create_shared_directory', controller.create_shared_directory);
module.exports = router;
