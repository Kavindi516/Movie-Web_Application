import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Rating,
  Grid,
  Card,
  CardMedia,
  Paper,
  Stack,
  Divider,
  useMediaQuery,
  useTheme,
  Button,
  IconButton,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../utils/api';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  

  useEffect(() => {
    const fetchMovie = async () => {
      const data = await getMovieDetails(id);
      const trailer = data?.videos?.results.find(
        (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
      );
      data.trailerKey = trailer ? trailer.key : null;
      setMovie(data);
      setLoading(false);
    };

    fetchMovie();
  }, [id]);

  // Here handle the trailer toggle
  const toggleTrailer = () => {
    setShowTrailer(!showTrailer);
  };

  if (loading || !movie) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <CircularProgress size={isMobile ? 40 : 60} />
    </Box>
  );

  // Here is just format runtime to hours and minutes
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Here exxtract the year from release date
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '';

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 3, sm: 4, md: 6 },
        px: { xs: 2, sm: 3 }
      }}
    >
      {/* Movie Hero Section */}
      <Paper 
        elevation={3} 
        sx={{
          borderRadius: { xs: 2, sm: 3 },
          overflow: 'hidden',
          mb: { xs: 3, sm: 4, md: 5 },
          position: 'relative',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(to bottom, rgba(30,30,30,0.8), rgba(20,20,20,0.95))' 
            : 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(240,240,240,0.95))'
        }}
      >
        {/* Inclyde a backdrop image as background */}
        {movie.backdrop_path && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.2,
              zIndex: 0
            }}
          />
        )}

        {/* Content container */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={0}>
            
            <Grid item xs={12} sm={5} md={4} lg={3}
              sx={{
                display: 'flex',
                justifyContent: isMobile ? 'center' : 'flex-start',
                p: { xs: 2, sm: 3 },
                pb: { xs: 0, sm: 3 } 
              }}
            >
              <Card 
                sx={{ 
                  width: isMobile ? '70%' : '100%',
                  maxWidth: { xs: 220, sm: 300 },
                  boxShadow: 4, 
                  borderRadius: 2,
                  aspectRatio: '2/3',
                  overflow: 'hidden'
                }}
              >
                <CardMedia
                  component="img"
                  image={movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={movie.title}
                  sx={{ 
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Card>
            </Grid>

            {/* Here is the info Section which is Full width on mobile, main column on larger screens */}
            <Grid item xs={12} sm={7} md={8} lg={9}>
              <Box 
                sx={{ 
                  p: { xs: 2, sm: 3 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Title and the Release Year */}
                <Typography 
                  variant={isMobile ? "h5" : "h4"} 
                  component="h1"
                  fontWeight={700} 
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                    lineHeight: 1.2
                  }}
                >
                  {movie.title}
                  {releaseYear && (
                    <Typography 
                      component="span" 
                      color="text.secondary" 
                      sx={{ 
                        ml: 1,
                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                      }}
                    >
                      ({releaseYear})
                    </Typography>
                  )}
                </Typography>

                {/* Meta information row */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={{ xs: 1, sm: 3 }}
                  divider={!isMobile ? <Divider orientation="vertical" flexItem /> : null}
                  sx={{ mb: 2 }}
                >
                  {/* Release date */}
                  {movie.release_date && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarMonthIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                      <Typography variant="body2">
                        {new Date(movie.release_date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Box>
                  )}
                  
                  {/* Runtime */}
                  {movie.runtime > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                      <Typography variant="body2">
                        {formatRuntime(movie.runtime)}
                      </Typography>
                    </Box>
                  )}
                  
                  {/* Rating */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StarIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.warning.main }} />
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {movie.vote_average.toFixed(1)}/10
                    </Typography>
                    <Rating
                      value={movie.vote_average / 2}
                      readOnly
                      precision={0.5}
                      size="small"
                    />
                  </Box>
                </Stack>

                {/* Genres */}
                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {movie.genres.map((genre) => (
                    <Chip
                      key={genre.id}
                      label={genre.name}
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                      variant="outlined"
                      sx={{ 
                        borderRadius: '16px',
                        fontWeight: 500
                      }}
                    />
                  ))}
                </Box>

                {/* Overview */}
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 3,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    lineHeight: 1.6,
                    flex: 1 // Take up available space
                  }}
                >
                  {movie.overview}
                </Typography>

                {/* Trailer Button */}
                {movie.trailerKey && (
                  <Box sx={{ mt: { xs: 0, sm: 'auto' } }}>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<PlayArrowIcon />}
                      onClick={toggleTrailer}
                      sx={{ 
                        borderRadius: '30px',
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem'
                      }}
                    >
                      Watch Trailer
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Here is the trailer Section */}
      {showTrailer && movie.trailerKey && (
        <Paper 
          elevation={4}
          sx={{ 
            position: 'relative',
            mb: { xs: 3, sm: 4 },
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              position: 'relative',
              paddingTop: '56.25%', // 16:9 aspect ratio
              width: '100%'
            }}
          >
            <IconButton
              onClick={toggleTrailer}
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 10,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>
            <iframe
              src={`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
            />
          </Box>
        </Paper>
      )}

    </Container>
  );
};

export default MovieDetails;