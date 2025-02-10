const Post = require('../models/Post');
const { uploadToS3 } = require('../utils/s3');

exports.createPost = async (req, res) => {
  try {
    const { content, is_public_preview } = req.body;
    let mediaUrl = null;

    if (req.file) {
      mediaUrl = await uploadToS3(req.file);
    }

    const post = await Post.create({
      user_id: req.user.id,
      content,
      media_url: mediaUrl,
      is_public_preview
    });

    // Notify connected clients about new post
    req.app.get('io').emit('newPost', post);

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [['created_at', 'DESC']],
      include: ['user', 'reactions', 'comments']
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};