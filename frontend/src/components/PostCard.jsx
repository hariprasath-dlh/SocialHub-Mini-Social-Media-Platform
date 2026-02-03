import { useState } from 'react';
import { Card, CardHeader, CardContent, CardMedia, CardActions, Typography, Avatar, IconButton, Box } from '@mui/material';
import { FavoriteBorder, Favorite, ChatBubbleOutline } from '@mui/icons-material';
import CommentSection from './CommentSection';
import { likePost } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post, onUpdate }) => {
    const [showComments, setShowComments] = useState(false);
    const [liking, setLiking] = useState(false);
    const { user } = useAuth();

    const hasLiked = user && post.likes?.includes(user.username);
    const likeCount = post.likes?.length || 0;

    const handleLike = async () => {
        if (liking || !user) return;

        try {
            setLiking(true);
            await likePost(post._id);
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('Post already liked');
            } else {
                console.error('Error liking post:', error);
            }
        } finally {
            setLiking(false);
        }
    };

    const handleCommentToggle = () => {
        setShowComments(!showComments);
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        return `${diffDays} days ago`;
    };

    return (
        <Card sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {post.username.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={post.username}
                subheader={formatTimestamp(post.createdAt)}
            />
            {post.image && (
                <CardMedia
                    component="img"
                    height="300"
                    image={`http://localhost:5000${post.image}`}
                    alt="Post image"
                    sx={{ objectFit: 'cover' }}
                />
            )}
            <CardContent>
                <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                    {post.text}
                </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton
                        onClick={handleLike}
                        color={hasLiked ? 'error' : 'default'}
                        size="small"
                        disabled={liking}
                    >
                        {hasLiked ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                        {likeCount}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
                    <IconButton onClick={handleCommentToggle} size="small">
                        <ChatBubbleOutline />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                        {post.comments?.length || 0}
                    </Typography>
                </Box>
            </CardActions>
            {showComments && <CommentSection postId={post._id} comments={post.comments || []} onUpdate={onUpdate} />}
        </Card>
    );
};

export default PostCard;
