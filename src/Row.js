import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const baseUrl = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }){
     const [movies, setMovies] = useState([]);
     const [trailerUrl, setTrailerUrl] = useState("");

     useEffect(() => {
          // if [], run once the rows , and dont run again
          async function fetchData(){
               const request = await axios.get(fetchUrl);
               setMovies(request.data.results);
               return request;
          }
          fetchData();
     }, [fetchUrl]);

     const opts = {
          height: "390",
          width: "100%",
          playerVars: { 
               // https://developers.google.com/youtube/player_parameters
               autoplay: 1,
          },
     };
     const handleClick = (movie) => {
          if(trailerUrl){
               setTrailerUrl("");
          }else{
               movieTrailer(movie?.name || "")
               .then(url => {
                    //to find the youtube url for find the trailer of the selected movie
                    const urlParam = new URLSearchParams(new URL(url).search);
                    setTrailerUrl(urlParam.get("v"));
               })
               .catch((error) => console.log(error));
          }
     };
     return (
          <div className="row">
               <h2>{title}</h2>
               <div className="row__posters">
                    {/** row_Poster(s) */}

                    {movies.map(movie => (
                        <img 
                         key={movie.id}
                         onClick={() => handleClick(movie)}
                         className={`row__poster ${ isLargeRow &&  "row__posterLarge"}` }
                         src={`${baseUrl}${
                              isLargeRow ?  movie.poster_path : movie.backdrop_path
                         }`} 
                         alt={movie.name} 
                        />  
                    ))}
                    { trailerUrl && <Youtube videoId={trailerUrl} opts={opts}/> }
               </div>
          </div>
     )
}

export default Row;