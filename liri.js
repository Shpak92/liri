require("dotenv").config();
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotifyKeys);
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

//Spotify Function
var spotifySearch = function(songSearch){
  if (songSearch === undefined) {
      songSearch = "Mo Bamba";
  }
  spotify.search(
      { type: 'track', 
      query: songSearch
      }, 
      function(err, data) {
      if (err) {
          console.log('Error occurred: ' + err);
          return;
      }
      
      var songChoice = data.tracks.items;
          
      for (i = 0; i < songChoice.length; i++) {
          
        console.log(i);
        console.log("artist(s): " + songChoice[i].artists.map(spotifySearch));
        console.log("Song Name: " + songChoice[i].name);
        console.log("Preview Link: " + songChoice[i].preview_url);
        console.log("Album :"+ songChoice[i].album.name );
  }
      }
      );
  };
  //OMBD Function
  var movieInfo = function (movieSearch)
  {
    if (movieSearch === undefined) {
        
          movieSearch = "Mr Nobody";
            }
      var queryURL = "http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&apikey=triology";
      axios.get(queryURL).then(
          function(response){
          var jsonData = response.data; 
          console.log("Title: " + jsonData.Title);
          console.log("Year: " + jsonData.Year);
          console.log("Rated: " + jsonData.imdbRating);
          console.log("Country: " + jsonData.Country);
          console.log("Language: " + jsonData.Language);
          console.log("Rotten Tomatoes: " + jsonData.Ratings[1].Value);
          console.log("Plot: " + jsonData.Plot);
          console.log("Actors: " + jsonData.Actors);
          }
          );
  };
  //BandsinTown Function
  var bandsInTown = function(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  
    axios.get(queryURL).then(
      function(response) {
        var jsonData = response.data;
  
        if (!jsonData.length) {
          console.log("No results found for " + artist);
          return;
        }
  
        console.log("Upcoming concerts for " + artist + ":");
  
        for (var i = 0; i < jsonData.length; i++) {
          var show = jsonData[i];
  
          console.log(
            show.venue.city +
              "," +
              (show.venue.region || show.venue.country) +
              " at " +
              show.venue.name +
              " " +
              moment(show.datetime).format("MM/DD/YYYY")
          );
        }
      }
    );
  };
  var doWhatItSays = function() {

    fs.readFile("random.txt", "utf8", function(error, data) 
    {
        console.log(data);
        var results = data.split(",");
        if (results.length === 2) {
            pick(results[0], results[1]);
          } else if (results.length === 1) {
            pick(results[0]);
          }
        });
      };
      
//Creating a switch for the functions
// Switch for commands for all functions
var commands = function (searches, information){
    switch(searches) {
        case "concert-this":
            bandsInTown(information);
            break;
        case "movie-this" :
        movieInfo(information);
            break;    
        case 'spotify-this-song':
            spotifySearch(information); 
            break;
        case 'do-what-it-says':
            doWhatItSays(); 
            break;
        default:
        console.log("Please write something useful!");
    }
};
var runThis = function(argOne, argTwo) {
    commands(argOne, argTwo);
  };

runThis(process.argv[2], process.argv.slice(3).join(" "));  





