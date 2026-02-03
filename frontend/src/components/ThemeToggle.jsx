import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

// Theme toggle button
// Switches between light and dark mode
const ThemeToggle = () => {
    const { mode, toggleTheme } = useTheme();

    return (
        <IconButton color="inherit" onClick={toggleTheme}>
            {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
    );
};

export default ThemeToggle;
