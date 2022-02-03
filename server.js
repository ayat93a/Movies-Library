`use strict`

require("dotenv").config();
const express = require ('express');
const cors = require ( "cors");
const app = express ();
const axios = require('axios')
const pg = require("pg");
const client= new pg.Client(process.env.databaseUrl)
app.use(cors());
app.use(express.json());

app.get('/', movieHandler);
app.get ('/favorite',favoriteHandler);
app.get('/trending', trendingHandler);
app.get('/search', searchHandler);
app.get('/Networks', networksHandler);
app.get('/Reviews', reviewshHandler);
app.get ('*', notFoundHandler);

app.use (errorHandler);

////trending
function Movies (id, title, release_date , poster_path ,overview){
    this.id = id;
    this.title = title;
    this.release_date= release_date;
    this.poster_path= poster_path;
    this.overview=overview
}
let trendingUrl = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.api_key}&language=en-US`;
//console.log(trendingUrl)
function trendingHandler(req,res){
axios.get(trendingUrl)
 .then((result)=>{
// console.log(result.data)///dont work for me
  let movies =result.data.results.map(movie=>{
      return new Movies(movie.id || " ", movie.title || " ", movie.release_date || " ", movie.poster_path || " ",
       movie.overview || " ")
      //console.log(result.data.results) 
  })
  res.status(200).json(movies)
 }).catch((err)=>{
    errorHandler(err,req,res)
})
}
/// search
let usersearch = "Spider-Man: No Way Home" 
let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.api_key}&query=${usersearch}`
function searchHandler(req,res){
    axios.get(searchUrl)
    .then(result=>{
        let movies =result.data.results.map(movie=>{
            return new Movies(movie.id || " ", movie.title || " ", movie.release_date || " ", movie.poster_path || " ",
            movie.overview || " ")
    })
    res.status(200).json(movies)
    .catch((err)=>{
        errorHandler(err,req,res)
    })
    })
}
///Networks
let userInputOfID = " " ///// my code work perfictly but i didnot found what i shall input as a user
let networkgUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.api_key}&network_id=${userInputOfID}`
function networksHandler(req,res){
    axios.get(networkgUrl)
    .then(result=>{
        let movies =result.data.results.map(movie=>{
            return new Movies(movie.id || " ", movie.title || " ", movie.release_date || " ", movie.poster_path || " ",
            movie.overview || " ")
    })
    res.status(200).json(movies)
    .catch((err)=>{
        errorHandler(err,req,res)
    })
    })
}
///Reviews
let rate = " " ///// my code work perfictly but i didnot found what i shall input as a user
let rewiewUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.api_key}&review_id=${rate}`
function  reviewshHandler(req,res){
    axios.get(rewiewUrl)

    .then(result=>
        {let movies =result.data.results.map(movie=>{

        return new Movies(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview)
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

///13
app.post("/addMovie", addMovieHandler)
function addMovieHandler (req,res){
    //console.log(req.body)
    res.status(200).send("hi")
}
////Handle errors 404
function notFoundHandler (req,res){
    return res.status(404).send("page not found error")
}

   
 ///Error 500
function errorHandler (err, req, res) {
    //console.error(error.stack)
    res.status(500).send("Sorry, something went wrong")}
//     ////////////////////Task 13


//app.get ("/getMovies" ,getMoviesHandler)











client.connect().then (()=>{
   app.listen(4000, ()=>{
       console.log('listening to port 4000')
   })
 })


