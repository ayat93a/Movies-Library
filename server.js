const express = require ('express');
const cors = require ( "cors");
const app = express ();
app.use(cors());
app.get('/', movieHandler);
app.get ('/favorite',favoriteHandler);
app.get ('*', notFoundHandler);
//app.use (errorHandler);
///function errorHandler (error, req, res) {
    //console.error(error.stack)
//     const error = {
//         status : 500 
//     }
//     res.status(500).send("Sorry, something went wrong")
//   
// host


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
////Handle errors 500
app.listen(3000, ()=>{
    console.log('listening to port 3000')
})