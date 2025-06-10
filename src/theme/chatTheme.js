import { createTheme } from '@mui/material/styles';

export const chatTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#667eea',
            light: '#8fa5ea',
            dark: '#4f63d2',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#764ba2',
            light: '#9575cd',
            dark: '#512da8',
            contrastText: '#ffffff',
        },
        success: {
            main: '#2e7d32',
            light: '#4caf50',
            dark: '#1b5e20',
        },
        error: {
            main: '#d32f2f',
            light: '#ef5350',
            dark: '#c62828',
        },
        info: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#1a202c',
            secondary: '#718096',
        },
        divider: '#e2e8f0',
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        subtitle1: {
            fontWeight: 500,
        },
        body1: {
            fontSize: '0.95rem',
        },
        body2: {
            fontSize: '0.875rem',
        },
        caption: {
            fontSize: '0.75rem',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                },
                elevation1: {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
                elevation2: {
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                },
                elevation3: {
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 12,
                    fontWeight: 500,
                    padding: '8px 20px',
                },
                contained: {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    '&:hover': {
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#667eea',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#667eea',
                            borderWidth: 2,
                        },
                    },
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    margin: '2px 8px',
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(102, 126, 234, 0.12)',
                        '&:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.16)',
                        },
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(102, 126, 234, 0.08)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    fontWeight: 500,
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
            },
        },
    },
});

export default chatTheme; 