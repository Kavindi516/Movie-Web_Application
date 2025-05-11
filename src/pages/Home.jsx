import React, { useEffect, useState, useCallback } from 'react';
import { 
  Typography, 
  Container, 
  CircularProgress, 
  Box, 
  Grid, 
  Button,
  useMediaQuery,
  useTheme,
  Fade,
  Collapse
} from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import { getTrendingMovies, searchMovies } from '../utils/api';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const [hasMoreSearchResults, setHasMoreSearchResults] = useState(true);
  const [visibleCount, setVisibleCount] = useState(isMobile ? 6 : 10);
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: 0,
  });

  const isSearchMode = search.trim() !== '';

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Check scroll position to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch initial trending movies
  const loadTrending = useCallback(async () => {
    setLoading(true);
    const data = await getTrendingMovies();
    setAllMovies(data);
    setLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    loadTrending();
  }, [loadTrending]);

  // Apply filters whenever movie list or filters change
  useEffect(() => {
    const filtered = allMovies.filter(
      (movie) =>
        (!filters.genre || movie.genre_ids?.includes(Number(filters.genre))) &&
        (!filters.year || movie.release_date?.startsWith(filters.year)) &&
        movie.vote_average >= filters.rating
    );
    setMovies(filtered);
    if (!isSearchMode) {
      setVisibleCount(isMobile ? 6 : 10); 
    }
  }, [filters, allMovies, search, isSearchMode, isMobile]);

  // Handle search input
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!isSearchMode) {
        setSearchPage(1);
        await loadTrending();
        setHasMoreSearchResults(false);
      } else {
        setLoading(true);
        const { results, totalPages } = await searchMovies(search, 1);
        const cleanedResults = results.filter(
          (movie) => movie.poster_path && movie.vote_average !== undefined
        );
        setAllMovies(cleanedResults);
        setSearchPage(2); // next page to fetch
        setHasMoreSearchResults(2 <= totalPages);
        setLoading(false);
      }

      if (!isSearchMode) {
        setVisibleCount(isMobile ? 6 : 10);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, isSearchMode, loadTrending, isMobile]);

  // Infinite scroll for search results
  useEffect(() => {
    const handleScroll = async () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;

      if (!loading && isSearchMode && hasMoreSearchResults && nearBottom) {
        setLoading(true);
        const { results, totalPages } = await searchMovies(search, searchPage);
        const cleanedResults = results.filter(
          (movie) => movie.poster_path && movie.vote_average !== undefined
        );
        setAllMovies((prev) => [...prev, ...cleanedResults]);
        setSearchPage((prev) => prev + 1);
        setHasMoreSearchResults(searchPage + 1 <= totalPages);
        setLoading(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSearchMode, search, searchPage, hasMoreSearchResults, loading]);

  // Calculate grid size based on screen size
  const getGridSize = () => {
    if (isMobile) return 6;  
    if (isTablet) return 4;  
    return 2.4; 
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        px: { xs: 1, sm: 2, md: 3 }, 
        py: { xs: 2, sm: 3, md: 4 },
        position: 'relative'
      }}
    >
      {/* Header */}
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          display: 'flex',
          alignItems: 'center',
          fontWeight: 700,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
          flexWrap: 'wrap',
        }}
      >
        <LocalFireDepartmentIcon 
          color="error" 
          sx={{ 
            mr: 1, 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' } 
          }} 
        />
        {isSearchMode ? 
          `Results for "${search.length > 15 && isMobile ? `${search.substring(0, 15)}...` : search}"` : 
          'Trending Now'
        }
      </Typography>

      {/* Mobile Filter Toggle Button */}
      {isMobile && (
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
          fullWidth
          sx={{ 
            mb: 2, 
            borderRadius: '8px',
            textTransform: 'none',
          }}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      )}

      {/* Search Bar - Always visible but responsive */}
      <SearchBar 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
        sx={{ 
          mb: { xs: 2, sm: 3, md: 3 },
          width: '100%'
        }} 
      />

      {/* Collapsible Filters */}
      <Collapse in={showFilters}>
        <FilterBar filters={filters} setFilters={setFilters} />
      </Collapse>

      {/* Movie Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 5, sm: 8, md: 10 } }}>
          <CircularProgress size={isMobile ? 40 : 60} />
        </Box>
      ) : (
        <>
          <Box id="movie-grid" sx={{ position: 'relative' }}></Box>
          {!loading && movies.length === 0 && (
            <Typography 
              variant={isMobile ? "body1" : "h6"} 
              sx={{ 
                my: { xs: 2, sm: 3, md: 4 },
                textAlign: 'center'
              }}
            >
              No movies found {search ? `for "${search}"` : ''}
            </Typography>
          )}
          <Grid container spacing={isMobile ? 1.5 : 3}>
            {(isSearchMode ? movies : movies.slice(0, visibleCount)).map((movie) => (
              <Grid 
                item 
                key={movie.id} 
                xs={6} 
                sm={4} 
                md={3} 
                lg={getGridSize()} 
                sx={{ 
                  maxWidth: { xs: '100%', sm: 240 } 
                }}
              >
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>

          {/* Load More Button only for trending */}
          {!isSearchMode && visibleCount < movies.length && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, sm: 3, md: 4 } }}>
              <Button
                variant="contained"
                color="primary"
                size={isMobile ? "medium" : "large"}
                onClick={() => setVisibleCount((prev) => prev + (isMobile ? 6 : 10))}
                sx={{
                  borderRadius: '30px',
                  textTransform: 'none',
                  px: { xs: 3, md: 4 },
                  py: { xs: 1, md: 1.5 },
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  fontWeight: 'bold',
                  boxShadow: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Load More
              </Button>
            </Box>
          )}
        </>
      )}

      {/* Scroll to top button */}
      <Fade in={showScrollTop}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            minWidth: '40px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            zIndex: 1000,
            p: 0,
            boxShadow: 3,
          }}
        >
          <ArrowUpwardIcon />
        </Button>
      </Fade>
    </Container>
  );
};

export default Home;