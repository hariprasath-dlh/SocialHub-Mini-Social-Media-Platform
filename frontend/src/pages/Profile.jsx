import { useState, useEffect } from 'react';
import { Container, Box, Avatar, Typography, Stack, Divider, Button, IconButton, Alert } from '@mui/material';
import { PhotoCamera, Delete as DeleteIcon } from '@mui/icons-material';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { getUserPosts, updateProfilePicture, removeProfilePicture } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const { socket } = useSocket();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchUserPosts = async () => {
    if (!authUser) return;

    try {
      setLoading(true);
      const data = await getUserPosts(authUser.username);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [authUser]);

  // Socket listener for real-time new posts
  useEffect(() => {
    if (!socket || !authUser) return;

    const handleNewPost = (newPost) => {
      // Only add post if it belongs to the current user
      if (newPost.username === authUser.username) {
        console.log('New post added to profile:', newPost);
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      }
    };

    socket.on('newPost', handleNewPost);

    return () => {
      socket.off('newPost', handleNewPost);
    };
  }, [socket, authUser]);

  // Handle profile picture upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB');
      return;
    }

    try {
      setUploading(true);
      setError('');

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('profileImage', file);

      // Upload to backend
      const response = await updateProfilePicture(formData);

      // Update user in AuthContext
      updateUser(response.user);

      console.log('Profile picture updated successfully');
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setError(err.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  // Handle profile picture removal
  const handleRemoveImage = async () => {
    try {
      setUploading(true);
      setError('');

      // Remove from backend
      const response = await removeProfilePicture();

      // Update user in AuthContext
      updateUser(response.user);

      console.log('Profile picture removed successfully');
    } catch (err) {
      console.error('Error removing profile picture:', err);
      setError(err.response?.data?.message || 'Failed to remove profile picture');
    } finally {
      setUploading(false);
    }
  };

  if (!authUser) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <EmptyState message="Please login to view your profile" />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
          p: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: 1
        }}
      >
        {/* Profile Picture with Upload/Remove */}
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Avatar
            src={authUser.profileImage ? `${import.meta.env.VITE_BACKEND_URL}${authUser.profileImage}` : undefined}
            alt={authUser.username}
            sx={{ width: 100, height: 100 }}
          >
            {!authUser.profileImage && authUser.username.charAt(0).toUpperCase()}
          </Avatar>

          {/* Upload Button */}
          <IconButton
            component="label"
            disabled={uploading}
            sx={{
              position: 'absolute',
              bottom: 0,
              right: -10,
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              width: 35,
              height: 35
            }}
          >
            <PhotoCamera fontSize="small" />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </IconButton>

          {/* Remove Button (only show if profile image exists) */}
          {authUser.profileImage && (
            <IconButton
              onClick={handleRemoveImage}
              disabled={uploading}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: -10,
                bgcolor: 'error.main',
                color: 'white',
                '&:hover': { bgcolor: 'error.dark' },
                width: 35,
                height: 35
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 400 }}>
            {error}
          </Alert>
        )}

        {/* User Info */}
        <Typography variant="h5" gutterBottom>
          {authUser.username}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {authUser.email}
        </Typography>

        {uploading && (
          <Typography variant="caption" color="text.secondary">
            {authUser.profileImage ? 'Updating...' : 'Uploading...'}
          </Typography>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h5" gutterBottom>
        My Posts
      </Typography>

      {loading ? (
        <LoadingSpinner />
      ) : posts.length === 0 ? (
        <EmptyState message="You haven't posted anything yet." />
      ) : (
        <Stack spacing={2} sx={{ mt: 3 }}>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onUpdate={fetchUserPosts} />
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default Profile;
