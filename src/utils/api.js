import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

//Create an Axios instance for making API requests to TMDb
const tmdb = axios.create({
    baseURL: BASE_URL,
    params:{
        api_key: API_KEY,
        language: 'en-US',
    },
});

//Get Trending Movies
export const getTrendingMovies = async () =>{
    try{
        const response = await tmdb?.get('/trending/movie/week');
        return response?.data?.results;
    }catch(error){
        console.error('Error fetching trending movies:', error);
        return[];
    }
};

//Search movies by title
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdb.get('/search/movie', {
      params: { query, page },
    });
    return {
      results: response.data.results,
      totalPages: response.data.total_pages,
      currentPage: response.data.page,
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    return {
      results: [],
      totalPages: 0,
      currentPage: 1,
    };
  }
};


//Get the movie details by ID
export const getMovieDetails = async (movieId) => {
    try{
        const response = await tmdb?.get(`/movie/${movieId}`,{
            params : {
               append_to_response: 'videos, credits',
            },
        });
        return response?.data;

    }   catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
};

//fetch genres
export const fetchGenres = async () => {
  const response = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
  return response?.data?.genres;
};