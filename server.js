const express = require ('express')
const cors = require ( "cors")
const app = express ();
app.use(cors());
app.get('/', movieHandler);
app.get ('/favorite',favoriteHandler);
app.get ('*', notFoundHandler);

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send(`"status" : 500,
    "responseText" : "Sorry, something went wrong"`)
  })

// host
app.listen(54172, ()=>{

    console.log('listening to port 54172')
})

///Home Page Endpoint
const movieData= require ("Movie Data/data.json")
function movie (title, poster_path , overview) {
    this.title = title;
    this.poster_path=poster_path;
    this.overview=overview;

}
function movieHandler (req,res){
    let myMovie = [];
    movieData.data.map (aMovie=>{
        let oneMovie = new movie ( aMovie.title, aMovie.poster_path,
            aMovie.overview)
            myMovie.push(oneMovie)
    })
    return res.status(200).json(myMovie)
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
