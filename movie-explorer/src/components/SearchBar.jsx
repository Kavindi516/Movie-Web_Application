import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ value, onChange}) =>{
    return(
        <TextField
          fullWidth
          placeholder="Search for movies..."
          variant="outlined"
          value = {value}
          onChange={onChange}
          sx={{mb:3}}
          InputProps={{
            startAdornment: (
                <InputAdornment position = "start">
                    <SearchIcon/>
                </InputAdornment>
                ),
            }}
        />
    );
}; 
export default SearchBar;