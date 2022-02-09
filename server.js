`use strict`

require("dotenv").config();
const express = require ('express');
const cors = require ( "cors");
const app = express ();
const axios = require('axios')
const pg = require("pg");//////////task 13
const client = new pg.Client({     connectionString: process.env.DATABASE_URL,     ssl: { rejectUnauthorized: false } })
//const client= new pg.Client(process.env.databaseUrl)//////////task 13
app.use(cors());
app.use(express.json()); ///////////task 13
app.get('/', movieHandler);
app.get ('/favorite',favoriteHandler);
app.get('/trending', trendingHandler);
app.get('/search', searchHandler);
app.get('/Networks', networksHandler);
app.get('/Reviews', reviewshHandler);
app.post("/addMovie", addMovieHandler);////////////////////task13
app.get("/getMovies", getMoviesHandler)


app.put(`/updateMovie/:id`,updateMoviHandler);///task14
app.delete(`/deleteMovie/:id`,deleteMovieHandler);///task14

app.get(`/getMovies/:id` , oneMovieHandler);////task14

app.get ('*', notFoundHandler);
app.use (errorHandler);

///task14
function updateMoviHandler(req ,res){
    //console.log(req.params.id)
    const id = req.params.id ;
    const movie = req.body;
    const sql = `UPDATE mymovies SET title=$1, release_date=$2 , poster_path=$3 , overview = $4 WHERE id=$5 RETURNING *;`
    let values=[movie.title, movie.release_date, movie.poster_path, movie.overview , id ];
    client.query(sql,values).then(data=>{
        res.status(200).json(data.rows);
    }).catch(error=>{
        errorHandler(error,req,res)
    });
}
function deleteMovieHandler (req,res){
    const id = req.params.id;
    const sql = `DELETE FROM mymovies WHERE id=${id};` 
    client.query(sql).then(()=>{
        res.status(200).send("The movie has been deleted");
    }).catch(error=>{
        errorHandler(error,req,res)
    });
}
function oneMovieHandler(req,res){
    let sql = `SELECT * FROM mymovies WHERE id=${req.params.id};`;
   client.query(sql).then(data=>{
    res.status(200).json(data.rows);
 }).catch(err=>{
     errorHandler(err,req,res)
 });
}

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


//////////////////////////////////////////////////Task13

function addMovieHandler (req,res){
   const movie= req.body
    let sql = `INSERT INTO mymovies(title,release_date, poster_path, overview) VALUES ($1 , $2 , $3 ,$4)RETURNING *;`
   let values =[movie.title, movie.release_date, movie.poster_path, movie.overview]
   client.query(sql,values).then(data =>{
    res.status(200).json(data.rows);
   }) .catch (err =>{
    errorHandler(err,req,res)
   })
  
}
//////////////
function getMoviesHandler (req,res){
    let sql = `SELECT * FROM mymovies;`
    client.query(sql).then(data=>{
      res.status(200).json(data.rows);
    }) .catch (err =>{
        errorHandler(err,req,res)
       })
}



//////////////////////errorsHandler


////Handle errors 404
function notFoundHandler (req,res){
    return res.status(404).send("page not found error")
}

   
 ///Error 500
function errorHandler (err, req, res) {
    //console.error(error.stack)
    res.status(500).send("Sorry, something went wrong")}


////////////////////////listen to port 

client.connect().then (()=>{
   app.listen(process.env.PORT, ()=>{
       console.log('listening to port 4000')
   })
 })
