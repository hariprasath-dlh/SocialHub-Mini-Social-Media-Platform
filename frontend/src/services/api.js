import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Add token to all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ==================== AUTH APIs ====================

export const register = async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
};

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const updateProfilePicture = async (formData) => {
    const response = await api.put('/auth/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const removeProfilePicture = async () => {
    const response = await api.delete('/auth/profile-picture');
    return response.data;
};

// ==================== POST APIs ====================

export const createPost = async (formData) => {
    const response = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const getAllPosts = async () => {
    const response = await api.get('/posts');
    return response.data;
};

export const getUserPosts = async (username) => {
    const response = await api.get(`/posts?username=${username}`);
    return response.data;
};

export const likePost = async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
};

export const addComment = async (postId, text) => {
    const response = await api.post(`/posts/${postId}/comment`, { text });
    return response.data;
};

export const editComment = async (postId, commentId, text) => {
    const response = await api.put(`/posts/${postId}/comment/${commentId}`, { text });
    return response.data;
};

export const deleteComment = async (postId, commentId) => {
    const response = await api.delete(`/posts/${postId}/comment/${commentId}`);
    return response.data;
};

export const likeComment = async (postId, commentId) => {
    const response = await api.post(`/posts/${postId}/comment/${commentId}/like`);
    return response.data;
};

export default api;
