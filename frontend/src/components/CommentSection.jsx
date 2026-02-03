import { useState } from 'react';
import { Box, Typography, TextField, Button, Divider, Stack, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Check as CheckIcon, Close as CloseIcon, FavoriteBorder, Favorite } from '@mui/icons-material';
import { addComment, editComment, deleteComment, likeComment } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ postId, comments, onUpdate }) => {
    const { user } = useAuth();
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState('');

    const handleSubmit = async () => {
        if (!commentText.trim() || !user) return;

        try {
            setSubmitting(true);
            await addComment(postId, commentText);
            setCommentText('');
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditStart = (comment) => {
        setEditingCommentId(comment._id);
        setEditText(comment.text);
    };

    const handleEditCancel = () => {
        setEditingCommentId(null);
        setEditText('');
    };

    const handleEditSave = async (commentId) => {
        if (!editText.trim() || !user) return;

        try {
            setSubmitting(true);
            await editComment(postId, commentId, editText);
            setEditingCommentId(null);
            setEditText('');
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('Error editing comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!user) return;

        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        try {
            setSubmitting(true);
            await deleteComment(postId, commentId);
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLikeComment = async (commentId) => {
        if (!user || submitting) return;

        try {
            setSubmitting(true);
            await likeComment(postId, commentId);
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('Comment already liked');
            } else {
                console.error('Error liking comment:', error);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ px: 2, pb: 2 }}>
            <Divider sx={{ mb: 2 }} />

            {comments.length > 0 && (
                <Stack spacing={1.5} sx={{ mb: 2 }}>
                    {comments.map((comment) => (
                        <Box key={comment._id}>
                            {editingCommentId === comment._id ? (
                                // Edit mode
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        disabled={submitting}
                                        autoFocus
                                    />
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleEditSave(comment._id)}
                                        disabled={submitting || !editText.trim()}
                                    >
                                        <CheckIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={handleEditCancel}
                                        disabled={submitting}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ) : (
                                // View mode
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                            {comment.username}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {comment.text}
                                        </Typography>
                                        {/* Comment Like Section */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleLikeComment(comment._id)}
                                                disabled={submitting}
                                                color={user && comment.likes?.includes(user.username) ? 'error' : 'default'}
                                            >
                                                {user && comment.likes?.includes(user.username) ? (
                                                    <Favorite fontSize="small" />
                                                ) : (
                                                    <FavoriteBorder fontSize="small" />
                                                )}
                                            </IconButton>
                                            <Typography variant="caption" color="text.secondary">
                                                {comment.likes?.length || 0}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Show edit/delete buttons only for comment owner */}
                                    {user && user.username === comment.username && (
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditStart(comment)}
                                                disabled={submitting}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(comment._id)}
                                                disabled={submitting}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Box>
                    ))}
                </Stack>
            )}

            {/* Add comment input */}
            {user && (
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Write a comment..."
                        variant="outlined"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        disabled={submitting}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleSubmit}
                        disabled={submitting || !commentText.trim()}
                    >
                        Post
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default CommentSection;
