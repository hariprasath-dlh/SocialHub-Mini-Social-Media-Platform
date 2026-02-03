import { useState, useEffect } from 'react';
import { IconButton, Badge, Menu, MenuItem, Typography, Box, Divider } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const NotificationMenu = () => {
    const { socket } = useSocket();
    const { user } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!socket || !user) return;

        const handleNotification = (notification) => {
            // Only show notification if it's for the current user
            if (notification.postOwner === user.username) {
                console.log('Notification received:', notification);
                setNotifications((prev) => [notification, ...prev].slice(0, 10)); // Keep last 10
                setUnreadCount((prev) => prev + 1);
            }
        };

        socket.on('notification', handleNotification);

        return () => {
            socket.off('notification', handleNotification);
        };
    }, [socket, user]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setUnreadCount(0); // Mark as read when opened
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClearAll = () => {
        setNotifications([]);
        setUnreadCount(0);
        handleClose();
    };

    if (!user) return null;

    return (
        <>
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: { width: 320, maxHeight: 400 }
                }}
            >
                <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Notifications</Typography>
                    {notifications.length > 0 && (
                        <Typography
                            variant="caption"
                            color="primary"
                            sx={{ cursor: 'pointer' }}
                            onClick={handleClearAll}
                        >
                            Clear All
                        </Typography>
                    )}
                </Box>
                <Divider />

                {notifications.length === 0 ? (
                    <MenuItem disabled>
                        <Typography variant="body2" color="text.secondary">
                            No notifications yet
                        </Typography>
                    </MenuItem>
                ) : (
                    notifications.map((notification, index) => (
                        <MenuItem key={index} onClick={handleClose}>
                            <Box>
                                <Typography variant="body2">
                                    {notification.message}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(notification.timestamp).toLocaleTimeString()}
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))
                )}
            </Menu>
        </>
    );
};

export default NotificationMenu;
