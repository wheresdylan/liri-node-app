require("dotenv").config();
var request = require("request");
var bandsintown = require('bandsintown')("codingbootcamp");
var moment = require('moment');
var fs = require("fs");
keys = require('./keys');
var Spotify = require('node-spotify-api');




var spotify = new Spotify(keys.spotify);

var input = "";



if (process.argv[2] === "spotify-this-song") {
    for (var i = 3; i < process.argv.length; i++) {
        input = input + " " + process.argv[i];
    }

    newSong(input);

} else if (process.argv[2] === "movie-this") {
    for (var i = 3; i < process.argv.length; i++) {
        input = input + "+" + process.argv[i];
    }

    movie(input);


}else if (process.argv[2] === "concert-this") {
    for (var i = 3; i < process.argv.length; i++) {
        input = input + " " + process.argv[i];
    }

    band(input);

}else if (process.argv[2] === "do-what-it-says"){

    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            console.log(err);
        }

        var newArray = data.split(",")

        if (newArray[0] === "spotify-this-song"){
            newSong(newArray[1]);
        }else if(newArray[0] === "movie-this"){
            movie(newArray[1]);
        }else if (newArray[0] === "concert-this"){
            band(newArray[1]);
        }

    })

}

function band(input){

    var divider = "\n------------------------------------------------------------\n\n";

    bandsintown
  .getArtistEventList(input.trim())
  .then(function(events) {


    var showData = [
        "Venue Name: " + events[0].venue.name,
        "Location: " + events[0].venue.place,
        "City: " + events[0].venue.city,
        "Country: " + events[0].venue.country,
        "Title: " + events[0].title,
        "Formatted Location: " + events[0].formatted_location,
        "Date: " + moment(events[0].datetime).format('L')
      ].join("\n\n");

      // Append showData and the divider to log.txt, print showData to the console
      fs.appendFile("log.txt", showData + divider, function(err) {
        if (err) throw err;
        console.log(showData);
      });

  });
}

function movie(input){

    var divider = "\n------------------------------------------------------------\n\n";

    request("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        if (!error && response.statusCode === 200) {


            var showData = [
                "Movie Title: " + JSON.parse(body).Title,
                "Year: " + JSON.parse(body).Year,
                "IMDB Rating: " + JSON.parse(body).imdbRating,
                "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value,
                "Country: " + JSON.parse(body).Country,
                "Language: " + JSON.parse(body).Language,
                "Plot: " + JSON.parse(body).Plot,
                "Actors: " + JSON.parse(body).Actors
              ].join("\n\n");

              fs.appendFile("log.txt", showData + divider, function(err) {
                if (err) throw err;
                console.log(showData);
              });

        }
    });
}

function newSong(input){

    var divider = "\n------------------------------------------------------------\n\n";

    spotify.search({ type: 'track', query: input }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var showData = [
            "Artist: " + data.tracks.items[0].album.artists[0].name,
            "Song Name: " + input.trim(),
            "Album Name: " + data.tracks.items[0].album.name,
            "Spotify Url To Listen: " + data.tracks.items[0].album.external_urls.spotify
          ].join("\n\n");

          fs.appendFile("log.txt", showData + divider, function(err) {
            if (err) throw err;
            console.log(showData);
          });

    });
}
