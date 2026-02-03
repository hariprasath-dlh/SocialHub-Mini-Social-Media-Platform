import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Alert,
} from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import LoadingSpinner from '../components/LoadingSpinner';
import { createPost } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL for display only
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview); // Clean up preview URL
    }
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!postText && !selectedImage) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('text', postText);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      await createPost(formData);

      // Clean up
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setPostText('');
      setSelectedImage(null);
      setImagePreview(null);
      navigate('/');
    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: { xs: 'auto', sm: 'calc(100vh - 100px)' },
        py: { xs: 2, sm: 4 },
      }}
    >
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Create New Post
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="What's on your mind?"
            multiline
            rows={4}
            fullWidth
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            sx={{ mb: 2 }}
            disabled={loading}
          />

          {imagePreview && (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
              <IconButton
                onClick={handleRemoveImage}
                disabled={loading}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  },
                }}
              >
                <Close />
              </IconButton>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
              disabled={loading}
              size="medium"
            >
              {selectedImage ? 'Change Image' : 'Add Image'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={!postText && !selectedImage}
            >
              Post
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreatePost;
