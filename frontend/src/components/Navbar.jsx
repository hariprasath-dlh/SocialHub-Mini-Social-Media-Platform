import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import NotificationMenu from './NotificationMenu';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          SocialHub
        </Typography>

        <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 2 }, alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              {/* Authenticated User Links */}
              <Button
                component={NavLink}
                to="/"
                color="inherit"
                sx={{
                  textTransform: 'none',
                  minWidth: { xs: 'auto', sm: '64px' },
                  px: { xs: 1, sm: 2 }
                }}
              >
                Feed
              </Button>
              <Button
                component={NavLink}
                to="/create"
                color="inherit"
                sx={{
                  textTransform: 'none',
                  minWidth: { xs: 'auto', sm: '64px' },
                  px: { xs: 1, sm: 2 }
                }}
              >
                Create
              </Button>
              <Button
                component={NavLink}
                to="/profile"
                color="inherit"
                sx={{
                  textTransform: 'none',
                  minWidth: { xs: 'auto', sm: '64px' },
                  px: { xs: 1, sm: 2 }
                }}
              >
                Profile
              </Button>
              <NotificationMenu />
              <ThemeToggle />
              <Button
                onClick={handleLogout}
                color="inherit"
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  minWidth: { xs: 'auto', sm: '64px' },
                  px: { xs: 1, sm: 2 },
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                  }
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* Unauthenticated User Links */}
              <ThemeToggle />
              <Button
                component={NavLink}
                to="/login"
                color="inherit"
                sx={{
                  textTransform: 'none',
                  minWidth: { xs: 'auto', sm: '64px' },
                  px: { xs: 1, sm: 2 }
                }}
              >
                Login
              </Button>
              <Button
                component={NavLink}
                to="/signup"
                color="inherit"
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  minWidth: { xs: 'auto', sm: '64px' },
                  px: { xs: 1, sm: 2 },
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                  }
                }}
              >
                Signup
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
