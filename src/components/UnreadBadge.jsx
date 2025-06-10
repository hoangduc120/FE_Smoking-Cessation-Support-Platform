import React from 'react';
import { Badge as MuiBadge } from '@mui/material';

const UnreadBadge = ({ count, children, sx = {} }) => {
    if (!count || count === 0) {
        return children || null;
    }

    const displayCount = count > 99 ? "99+" : count;

    return (
        <MuiBadge
            badgeContent={displayCount}
            color="error"
            sx={{
                '& .MuiBadge-badge': {
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    minWidth: 18,
                    height: 18,
                    animation: 'pulse 2s infinite',
                    ...sx
                }
            }}
        >
            {children}
        </MuiBadge>
    );
};

export default UnreadBadge; 