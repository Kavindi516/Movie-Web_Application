import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Container, useTheme, Button } from '@mui/material';
import MovieCard from '../components/MovieCard';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

// This component displays the user's favorite movies stored in localStorage
const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(stored);
  }, []);

  // Clear all favorite movies from localStorage
  const handleClearFavorites = () => {
    localStorage.removeItem('favorites');
    setFavorites([]);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Your Favorite Movies
        </Typography>

        {favorites.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteSweepIcon />}
            onClick={handleClearFavorites}
          >
            Clear All
          </Button>
        )}
      </Box>

      {favorites.length === 0 ? (
        // Show this message when no favorites are found
        <Box
          sx={{
            mt: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '40vh',
            textAlign: 'center',
            backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f9f9f9',
            borderRadius: 3,
            p: 5,
            boxShadow: 1,
          }}
        >
          <FavoriteBorderIcon sx={{ fontSize: 60, color: theme.palette.text.disabled, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No favorites yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You haven’t added any movies to your favorites. Browse and click the ❤️ icon to save
            them here.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((movie) => (
            <Grid
              item
              key={movie.id}
              xs={6}
              sm={4}
              md={3}
              lg={2.4}
              sx={{ maxWidth: { xs: '100%', sm: 240 } }}
            >
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Favorites;
