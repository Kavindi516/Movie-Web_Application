import React, { useContext } from "react";
import { useTheme } from "@mui/material/styles";
//import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 

import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Rating,
  Box,
  IconButton,
  styled,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FavoritesContext } from "../context/FavoritesContext";

const MovieCardContainer = styled(Card)(({ theme }) => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: "12px",
  overflow: "hidden",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: theme.shadows[6],
  },
}));

const MovieCard = ({ movie }) => {
  const theme = useTheme();
  const { isFavorite, addFavorite, removeFavorite } =
    useContext(FavoritesContext);
  const favorited = isFavorite(movie.id);

  const toggleFavorite = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    favorited ? removeFavorite(movie.id) : addFavorite(movie);
  };

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (!user) {
      navigate("/login"); // Redirect to login
    } else {
      navigate(`/movie/${movie.id}`);
    }
  };

  return (
    <MovieCardContainer>
      <CardActionArea
        onClick={handleCardClick}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Poster */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            image={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={movie.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Rating badge */}
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,.75)",
              color: "#fff",
              borderRadius: 1,
              px: 0.5,
              py: 0.25,
              display: "flex",
              alignItems: "center",
            }}
          >
            <StarIcon sx={{ fontSize: "1rem", mr: 0.5 }} />
            <Typography variant="caption">
              {movie.vote_average?.toFixed(1) || "NR"}
            </Typography>
          </Box>

          {/* Favorite Icon Button */}
          <IconButton
            onClick={toggleFavorite}
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(0,0,0,0.6)"
                  : "rgba(255,255,255,0.85)",
              color: theme.palette.mode === "dark" ? "#fff" : "inherit",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(0,0,0,0.8)"
                    : "rgba(255,255,255,1)",
              },
              zIndex: 1,
            }}
            size="small"
          >
            {favorited ? (
              <FavoriteIcon color="error" fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </IconButton>
        </Box>

        {/* Content  */}
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
            px: 1.5,
            py: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mb: 0.5,
              minHeight: "3em", 
            }}
          >
            {movie.title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              //alignItems: 'center',
              //mt: 'auto' // Pushes to bottom
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {movie.release_date?.split("-")[0] || "N/A"}
            </Typography>
            <Rating
              value={(movie.vote_average || 0) / 2}
              precision={0.5}
              readOnly
              size="small"
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </MovieCardContainer>
  );
};

export default MovieCard;
