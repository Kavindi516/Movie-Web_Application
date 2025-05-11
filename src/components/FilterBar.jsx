import React, { useEffect, useState } from 'react';
import {
  Box, FormControl, InputLabel, Select, MenuItem, Slider, Typography
} from '@mui/material';
import { fetchGenres } from '../utils/api';

const FilterBar = ({ filters, setFilters }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchGenres().then(setGenres);
  }, []);

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Box display="flex" flexWrap="wrap" gap={3} p={2}>
      {/* Genre */}
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Genre</InputLabel>
        <Select
          value={filters?.genre}
          label="Genre"
          onChange={e => handleChange('genre', e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {genres.map(genre => (
            <MenuItem key={genre.id} value={genre.id}>{genre.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Year */}
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Year</InputLabel>
        <Select
          value={filters.year}
          label="Year"
          onChange={e => handleChange('year', e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {Array.from({ length: 50 }, (_, i) => 2025 - i).map(year => (
            <MenuItem key={year} value={year}>{year}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Rating Slider */}
      <Box sx={{ width: 200 }}>
        <Typography gutterBottom>Min Rating</Typography>
        <Slider
          value={filters.rating}
          onChange={(_, value) => handleChange('rating', value)}
          step={0.5}
          min={0}
          max={10}
          valueLabelDisplay="auto"
        />
      </Box>
    </Box>
  );
};

export default FilterBar;