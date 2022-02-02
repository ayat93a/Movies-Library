`use strict`

require("dotenv").config();
const express = require ('express');
const cors = require ( "cors");
const app = express ();
const axios = require('axios')
const PORT = 5500 ;
app.use(cors());
app.get('/', movieHandler);
app.get ('/favorite',favoriteHandler);
app.get('/trending', trendingHandler);
app.get('/search', searchHandler);
app.get('/Networks', networksHandler);
app.get('/Reviews', reviewshHandler);
app.get ('*', notFoundHandler);
app.use (errorHandler);

////trending
function Movies (id, title, releaseDate, posterPath ,overview){
    this.id = id;
    this.title = title;
    this.releaseDate = releaseDate;
    this.posterPath= posterPath;
    this.overview
}
let trendingUrl = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`;
function trendingHandler(res,req){
axios.get(trendingUrl)
 .then((result)=>{
    // console.log(data.data.movies)///dont work for me
  let movies =result.data.results.map(movie=>{
      return new Movies(movie.id, movie.title, movie.releaseDate, movie.posterPath, movie.overview)
  })
  res.status(200).json(movies)
 }).catch((err)=>{
    errorHandler(err,req,res)
})
}
/// search
let usersearch = " kids" /// all films in the link isn't for adult
let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&query=${usersearch}`
function searchHandler(res,req){
    axios.get(trendingUrl)
    .then(result=>{
        let movies =result.data.results.map(movie=>{
        return new Movies(movie.id, movie.title, movie.releaseDate, movie.posterPath, movie.overview)
    })
    res.status(200).json(movies)
    .catch((err)=>{
        errorHandler(err,req,res)
    })
    })
}
///Networks
let userInputOfID = "1234"
let networkgUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&network_id=${userInputOfID}`
function networksHandler(res,req){
    axios.get(networkgUrl)
    .then(result=>{let movies =result.data.results.map(movie=>{
        return new Movies(movie.id, movie.title, movie.releaseDate, movie.posterPath, movie.overview)
    })
    res.status(200).json(movies)
    .catch((err)=>{
        errorHandler(err,req,res)
    })
    })
}
///Reviews
let rate = "5"
let rewiewUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&review_id=${rate}`
function  reviewshHandler(res,req){
    axios.get(rewiewUrl)
    .then(result=>{let movies =result.data.results.map(movie=>{
        return new Movies(movie.id, movie.title, movie.releaseDate, movie.posterPath, movie.overview)
    })
    res.status(200).json(movies)
    .catch((err)=>{
        errorHandler(err,req,res)
    })
    })
}
//Home Page Endpoint
const movieData= require ("./MovieData/data.json")
function movie (title, poster_path , overview) {
    this.title = title;
    this.poster_path=poster_path;
    this.overview=overview;
}
function movieHandler (req,res){
        let oneMovie = new movie ( movieData.title, movieData.poster_path,
            movieData.overview)
    
  res.send(oneMovie)
}
//// Favorite Page Endpoint
function favoriteHandler (req,res){
    return res.status(200).send ("Welcome to Favorite Page") ;
} 
////Handle errors 404
function notFoundHandler (req,res){
    return res.status(404).send("page not found error")

}
 ///Error 500
function errorHandler (error, req, res) {
    //console.error(error.stack)
    res.status(500).send("Sorry, something went wrong")}

////// host
app.listen(PORT, ()=>{
    console.log(`listening to port ${PORT}`)
})
