import Post from "../models/Post.js";
import User from "../models/User.js";


export const createPost = async (req, res) => {
  try {
    const { text } = req.body;

    // Get image path from uploaded file (if any)
    const imagePath = req.file ? `/uploads/posts/${req.file.filename}` : '';

    // At least one field required
    if (!text && !imagePath) {
      return res
        .status(400)
        .json({ message: "Post must contain text or image" });
    }

    // Get authenticated user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = new Post({
      username: user.username,
      text: text || "",
      image: imagePath,
    });

    await newPost.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.emit('newPost', newPost);

    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const { username } = req.query;

    let query = {};
    if (username) {
      query.username = username;
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Get authenticated user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Prevent duplicate likes
    if (post.likes.includes(user.username)) {
      return res.status(400).json({ message: "Post already liked" });
    }

    post.likes.push(user.username);
    await post.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.emit('likePost', { postId: post._id, likes: post.likes });

    // Emit notification to post owner (if not liking own post)
    if (post.username !== user.username) {
      io.emit('notification', {
        type: 'like',
        postId: post._id,
        username: user.username,
        postOwner: post.username,
        message: `${user.username} liked your post`,
        timestamp: new Date()
      });
    }

    res.status(200).json({ message: "Post liked", likes: post.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to like post" });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // Get authenticated user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({ username: user.username, text });
    await post.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.emit('newComment', { postId: post._id, comments: post.comments });

    // Emit notification to post owner (if not commenting on own post)
    if (post.username !== user.username) {
      io.emit('notification', {
        type: 'comment',
        postId: post._id,
        username: user.username,
        postOwner: post.username,
        message: `${user.username} commented on your post`,
        timestamp: new Date()
      });
    }

    res.status(200).json({
      message: "Comment added",
      comments: post.comments,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// Edit comment
export const editComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // Get authenticated user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the comment owner
    if (comment.username !== user.username) {
      return res.status(403).json({ message: "You can only edit your own comments" });
    }

    comment.text = text;
    await post.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.emit('editComment', { postId: post._id, comments: post.comments });

    res.status(200).json({
      message: "Comment updated",
      comments: post.comments,
    });
  } catch (error) {
    console.error('Edit comment error:', error);
    res.status(500).json({ message: "Failed to edit comment" });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    // Get authenticated user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the comment owner
    if (comment.username !== user.username) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    comment.remove();
    await post.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.emit('deleteComment', { postId: post._id, comments: post.comments });

    res.status(200).json({
      message: "Comment deleted",
      comments: post.comments,
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

// Like a comment
export const likeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    // Get authenticated user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Prevent duplicate likes
    if (comment.likes.includes(user.username)) {
      return res.status(400).json({ message: "Comment already liked" });
    }

    comment.likes.push(user.username);
    await post.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.emit('commentLike', { postId: post._id, commentId: comment._id, likes: comment.likes });

    res.status(200).json({
      message: "Comment liked",
      likes: comment.likes.length
    });
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ message: "Failed to like comment" });
  }
};
