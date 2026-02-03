import { useState, useEffect } from 'react';
import { Container, Stack, Typography } from '@mui/material';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAllPosts } from '../services/api';
import { useSocket } from '../context/SocketContext';

const Feed = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const { socket } = useSocket();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    // Listen for new posts
    const handleNewPost = (newPost) => {
      console.log('New post received:', newPost);
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    };

    // Listen for post likes
    const handleLikePost = ({ postId, likes }) => {
      console.log('Post liked:', postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes } : post
        )
      );
    };

    // Listen for new comments
    const handleNewComment = ({ postId, comments }) => {
      console.log('New comment:', postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments } : post
        )
      );
    };

    // Listen for edited comments
    const handleEditComment = ({ postId, comments }) => {
      console.log('Comment edited:', postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments } : post
        )
      );
    };

    // Listen for deleted comments
    const handleDeleteComment = ({ postId, comments }) => {
      console.log('Comment deleted:', postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments } : post
        )
      );
    };

    // Listen for comment likes
    const handleCommentLike = ({ postId, commentId, likes }) => {
      console.log('Comment liked:', commentId);
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            const updatedComments = post.comments.map((comment) =>
              comment._id === commentId ? { ...comment, likes } : comment
            );
            return { ...post, comments: updatedComments };
          }
          return post;
        })
      );
    };

    socket.on('newPost', handleNewPost);
    socket.on('likePost', handleLikePost);
    socket.on('newComment', handleNewComment);
    socket.on('editComment', handleEditComment);
    socket.on('deleteComment', handleDeleteComment);
    socket.on('commentLike', handleCommentLike);

    // Cleanup listeners on unmount
    return () => {
      socket.off('newPost', handleNewPost);
      socket.off('likePost', handleLikePost);
      socket.off('newComment', handleNewComment);
      socket.off('editComment', handleEditComment);
      socket.off('deleteComment', handleDeleteComment);
      socket.off('commentLike', handleCommentLike);
    };
  }, [socket]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Feed
      </Typography>

      {posts.length === 0 ? (
        <EmptyState message="No posts yet. Be the first to post!" />
      ) : (
        <Stack spacing={2} sx={{ mt: 3 }}>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default Feed;
