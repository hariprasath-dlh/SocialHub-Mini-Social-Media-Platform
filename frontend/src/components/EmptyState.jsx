import { Box, Typography } from '@mui/material';

const EmptyState = ({ message = 'No data available' }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '300px',
                textAlign: 'center',
            }}
        >
            <Typography variant="h6" color="text.secondary">
                {message}
            </Typography>
        </Box>
    );
};

export default EmptyState;
