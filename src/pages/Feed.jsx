import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardHeader,
  Avatar,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  Send as SendIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { supabase } from '../lib/supabase';
import { uploadToS3 } from '../utils/s3Client';
import toast from 'react-hot-toast';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    media: null,
    mediaType: null,
    mediaPreview: null,
  });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data: posts, error } = await supabase
        .from('posts')
        .select(`
          *,
          users:user_id (
            username,
            profile_picture
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(posts);
    } catch (error) {
      toast.error('Error loading posts');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      toast.error('Please select an image or video file');
      return;
    }

    const preview = URL.createObjectURL(file);
    setNewPost({
      ...newPost,
      media: file,
      mediaType: isImage ? 'image' : 'video',
      mediaPreview: preview,
    });
  };

  const handleSubmit = async () => {
    if (!newPost.content && !newPost.media) {
      toast.error('Please add some content to your post');
      return;
    }

    setPosting(true);
    try {
      let mediaUrl = null;
      if (newPost.media) {
        mediaUrl = await uploadToS3(newPost.media);
      }

      const user = supabase.auth.user();
      const { error } = await supabase.from('posts').insert({
        content: newPost.content,
        media_url: mediaUrl,
        media_type: newPost.mediaType,
        user_id: user.id,
      });

      if (error) throw error;

      toast.success('Post created successfully!');
      setCreateOpen(false);
      setNewPost({ content: '', media: null, mediaType: null, mediaPreview: null });
      fetchPosts();
    } catch (error) {
      toast.error('Error creating post');
      console.error('Error:', error);
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() => setCreateOpen(true)}
          sx={{ py: 2 }}
        >
          Create New Post
        </Button>
      </Box>

      {/* Posts Feed */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {posts.map((post) => (
          <Card key={post.id} sx={{ overflow: 'hidden' }}>
            <CardHeader
              avatar={
                <Avatar
                  src={post.users.profile_picture}
                  alt={post.users.username}
                >
                  {post.users.username[0].toUpperCase()}
                </Avatar>
              }
              title={post.users.username}
              subheader={new Date(post.created_at).toLocaleDateString()}
            />
            {post.media_url && (
              post.media_type === 'video' ? (
                <video
                  controls
                  style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
                >
                  <source src={post.media_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <CardMedia
                  component="img"
                  image={post.media_url}
                  alt="Post media"
                  sx={{ maxHeight: '500px', objectFit: 'contain' }}
                />
              )
            )}
            <CardContent>
              <Typography variant="body1">{post.content}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Create Post Dialog */}
      <Dialog
        open={createOpen}
        onClose={() => !posting && setCreateOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Create New Post
          {!posting && (
            <IconButton
              onClick={() => setCreateOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            placeholder="What's on your mind?"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            disabled={posting}
            sx={{ mt: 2 }}
          />
          {newPost.mediaPreview && (
            <Box sx={{ mt: 2, position: 'relative' }}>
              {newPost.mediaType === 'video' ? (
                <video
                  controls
                  style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                >
                  <source src={newPost.mediaPreview} />
                </video>
              ) : (
                <img
                  src={newPost.mediaPreview}
                  alt="Preview"
                  style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                />
              )}
              {!posting && (
                <IconButton
                  onClick={() => setNewPost({ ...newPost, media: null, mediaPreview: null })}
                  sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper' }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <input
            accept="image/*,video/*"
            id="media-upload"
            type="file"
            hidden
            onChange={handleMediaSelect}
            disabled={posting}
          />
          <label htmlFor="media-upload">
            <Button
              component="span"
              startIcon={<ImageIcon />}
              disabled={posting}
              sx={{ mr: 1 }}
            >
              Add Media
            </Button>
          </label>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={posting}
            startIcon={posting ? <CircularProgress size={20} /> : <SendIcon />}
          >
            {posting ? 'Posting...' : 'Post'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Feed;