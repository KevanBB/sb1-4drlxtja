const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { auth, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, checkRole(['admin']), upload.single('media'), postController.createPost);
router.get('/', auth, postController.getPosts);

module.exports = router;