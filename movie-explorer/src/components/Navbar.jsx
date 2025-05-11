import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Chip,
  Switch,
  Tooltip,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useThemeContext } from '../context/ThemeContext';

// Icons
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useThemeContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Used MUI's useTheme and useMediaQuery for responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    if (mobileOpen) setMobileOpen(false);
  };

  // Common styles
  const listItemStyle = {
    borderRadius: '8px',
    mx: 1,
    mb: 0.5,
    '&:hover': {
      backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,0,0,0.08)',
    },
  };

  const textStyle = {
    fontFamily: '"Inter", "Roboto", sans-serif',
    fontWeight: 500,
    fontSize: '0.95rem',
  };

  // Drawer content for mobile view
  const drawer = (
    <Box
      sx={{
        width: 250,
        height: '100%',
        bgcolor: darkMode ? '#0a0a0a' : '#f8f8f8',
        color: darkMode ? '#f0f0f0' : '#121212',
      }}
      role="presentation"
      onClick={handleDrawerToggle}
    >
      <Typography
        variant="h6"
        component={Link}
        to="/"
        sx={{
          p: 2.5,
          fontWeight: 700,
          textAlign: 'center',
          borderBottom: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`,
          color: darkMode ? '#ff1a1a' : '#cc0000',
          textDecoration: 'none',
          display: 'block',
          fontFamily: '"Montserrat", "Roboto", sans-serif',
          letterSpacing: '0.5px',
        }}
      >
        🎥 MovieExplorer
      </Typography>

      <List sx={{ py: 1.5 }}>
        <ListItem button component={Link} to="/" sx={listItemStyle}>
          <ListItemIcon>
            <HomeIcon sx={{ color: darkMode ? '#ff3333' : '#cc0000' }} />
          </ListItemIcon>
          <ListItemText primary="Home" primaryTypographyProps={textStyle} />
        </ListItem>

        {user ? (
          <>
            <ListItem button component={Link} to="/favorites" sx={listItemStyle}>
              <ListItemIcon>
                <BookmarkIcon sx={{ color: darkMode ? '#ff6666' : '#e60000' }} />
              </ListItemIcon>
              <ListItemText primary="Favorites" primaryTypographyProps={textStyle} />
            </ListItem>

            <Divider
              sx={{ my: 1.5, bgcolor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }}
            />

            <ListItem button onClick={handleLogout} sx={listItemStyle}>
              <ListItemIcon>
                <ExitToAppIcon sx={{ color: darkMode ? '#ff4d4d' : '#cc0000' }} />
              </ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={textStyle} />
            </ListItem>

            <ListItem sx={{ justifyContent: 'center', mt: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  py: 1,
                  px: 2,
                  borderRadius: '12px',
                  backgroundColor: darkMode ? 'rgba(255,0,0,0.1)' : 'rgba(255,0,0,0.05)',
                }}
              >
                <Avatar
                  sx={{
                    mr: 1.5,
                    bgcolor: darkMode ? '#cc0000' : '#990000',
                    fontFamily: '"Montserrat", sans-serif',
                    fontWeight: 600,
                  }}
                >
                  {user.username[0].toUpperCase()}
                </Avatar>
                <Typography sx={textStyle}>{user.username}</Typography>
              </Box>
            </ListItem>
          </>
        ) : (
          <ListItem button component={Link} to="/login" sx={listItemStyle}>
            <ListItemIcon>
              <LoginIcon sx={{ color: darkMode ? '#ff3333' : '#cc0000' }} />
            </ListItemIcon>
            <ListItemText primary="Login" primaryTypographyProps={textStyle} />
          </ListItem>
        )}

        <Divider
          sx={{ my: 1.5, bgcolor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }}
        />

        <ListItem sx={listItemStyle}>
          <ListItemIcon>
            {darkMode ? (
              <DarkModeIcon sx={{ color: '#ff6666' }} />
            ) : (
              <LightModeIcon sx={{ color: '#cc0000' }} />
            )}
          </ListItemIcon>
          <ListItemText primary="Dark Mode" primaryTypographyProps={textStyle} />
          <Switch checked={darkMode} onChange={toggleTheme} color="error" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: darkMode
            ? 'linear-gradient(135deg, #000000 0%, #1a0000 50%,rgb(80, 14, 14) 100%)'
            : 'linear-gradient(135deg, #f5f5f5, #ffe6e6, #ffcccc)',
          color: darkMode ? '#ffffff' : '#121212',
          boxShadow: darkMode ? '0 4px 12px rgba(255,0,0,0.3)' : '0 2px 8px rgba(255,0,0,0.15)',
          zIndex: 1200,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            px: { xs: 2, sm: 4 },
            py: { xs: 1.2, sm: 1.5 },
            minHeight: { xs: '68px', sm: '72px' },
          }}
        >
          {/* Left side: Logo and hamburger on mobile, Logo and nav links on desktop */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1.5 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant={isMobile ? 'body1' : 'h6'}
              component={Link}
              to="/"
              sx={{
                color: darkMode ? '#ff3333' : '#cc0000',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: { xs: '1.2rem', sm: '1.35rem' },
                fontFamily: '"Montserrat", "Roboto", sans-serif',
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              🎥 MovieExplorer
            </Typography>

            {/* Show navigation links only on desktop */}
            {!isMobile && user && (
              <Button
                component={Link}
                to="/favorites"
                color="inherit"
                startIcon={<BookmarkIcon sx={{ color: darkMode ? '#ff6666' : '#e60000' }} />}
                sx={{
                  fontWeight: 600,
                  ml: 3.5,
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '1.05rem',
                  textTransform: 'none',
                  borderRadius: '8px',
                  py: 0.8,
                  px: 2,
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(255,0,0,0.15)' : 'rgba(255,0,0,0.08)',
                  },
                }}
              >
                Favorites
              </Button>
            )}
          </Box>

          {/* Right side: Controls vary by screen size */}
          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {/* Dark Mode Toggle */}
              <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {darkMode ? (
                    <DarkModeIcon sx={{ color: '#ff6666' }} />
                  ) : (
                    <LightModeIcon sx={{ color: '#cc0000' }} />
                  )}
                  <Switch checked={darkMode} onChange={toggleTheme} color="error" />
                </Box>
              </Tooltip>

              {user ? (
                <Chip
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: darkMode ? '#cc0000' : '#990000',
                        fontFamily: '"Montserrat", sans-serif',
                        width: 32,
                        height: 32,
                      }}
                    >
                      {user.username[0].toUpperCase()}
                    </Avatar>
                  }
                  label={user.username}
                  deleteIcon={<ExitToAppIcon />}
                  onDelete={handleLogout}
                  sx={{
                    color: darkMode ? 'white' : '#212121',
                    backgroundColor: darkMode ? 'rgba(255,0,0,0.15)' : 'rgba(255,0,0,0.08)',
                    borderRadius: '20px',
                    height: '40px',
                    '& .MuiChip-label': {
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 500,
                      fontSize: '1rem',
                      px: 1.5,
                    },
                    '& .MuiChip-deleteIcon': {
                      color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)',
                      fontSize: '1.2rem',
                    },
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(255,0,0,0.25)' : 'rgba(255,0,0,0.12)',
                    },
                  }}
                />
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  color="inherit"
                  startIcon={<LoginIcon />}
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1.05rem',
                    borderRadius: '8px',
                    py: 0.8,
                    px: 2,
                    backgroundColor: darkMode ? 'rgba(255,0,0,0.15)' : 'rgba(255,0,0,0.08)',
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(255,0,0,0.25)' : 'rgba(255,0,0,0.12)',
                    },
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          ) : (
            // On mobile, just show current username if logged in
            user && (
              <Chip
                avatar={
                  <Avatar
                    sx={{
                      height: 26,
                      width: 26,
                      bgcolor: darkMode ? '#cc0000' : '#990000',
                    }}
                  >
                    {user.username[0].toUpperCase()}
                  </Avatar>
                }
                label={user.username}
                size="small"
                sx={{
                  color: darkMode ? 'white' : '#212121',
                  backgroundColor: darkMode ? 'rgba(255,0,0,0.15)' : 'rgba(255,0,0,0.08)',
                  height: 32,
                  '& .MuiChip-label': {
                    fontSize: '0.8rem',
                    px: 1.5,
                    fontFamily: '"Inter", sans-serif',
                  },
                }}
              />
            )
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
            //height: 250,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
