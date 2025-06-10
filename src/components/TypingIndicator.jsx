import React from 'react';
import { Box, Typography, Stack, keyframes } from '@mui/material';

const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
`;

const TypingIndicator = ({ typingUsers = [], sx = {} }) => {
    if (!typingUsers || typingUsers.length === 0) {
        return null;
    }

    const renderTypingDots = () => (
        <Stack direction="row" spacing={0.5} alignItems="center">
            <Box
                sx={{
                    width: 6,
                    height: 6,
                    bgcolor: 'primary.main',
                    borderRadius: '50%',
                    animation: `${bounce} 1.4s infinite ease-in-out`,
                }}
            />
            <Box
                sx={{
                    width: 6,
                    height: 6,
                    bgcolor: 'primary.main',
                    borderRadius: '50%',
                    animation: `${bounce} 1.4s infinite ease-in-out`,
                    animationDelay: '0.16s',
                }}
            />
            <Box
                sx={{
                    width: 6,
                    height: 6,
                    bgcolor: 'primary.main',
                    borderRadius: '50%',
                    animation: `${bounce} 1.4s infinite ease-in-out`,
                    animationDelay: '0.32s',
                }}
            />
        </Stack>
    );

    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
                color: 'primary.main',
                fontStyle: 'italic',
                ...sx
            }}
        >
            {renderTypingDots()}
            <Typography variant="caption" color="primary.main" fontStyle="italic">
                đang nhập...
            </Typography>
        </Stack>
    );
};

export default TypingIndicator; 