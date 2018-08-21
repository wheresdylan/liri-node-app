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
    bandsintown
  .getArtistEventList(input.trim())
  .then(function(events) {
    console.log(events[0].venue.name);

    //place
    console.log(events[0].venue.place);
    //city
    console.log(events[0].venue.city);
    //country
    console.log(events[0].venue.country);

    console.log(events[0].title);

    console.log(events[0].formatted_location);

    console.log(moment(events[0].datetime).format('L'));
  });
}

function movie(input){

    request("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        if (!error && response.statusCode === 200) {


            console.log(JSON.parse(body).Title);
            console.log(JSON.parse(body).Year);
            console.log(JSON.parse(body).imdbRating);
            console.log(JSON.parse(body).Ratings[1].Value);
            console.log(JSON.parse(body).Country);
            console.log(JSON.parse(body).Language);
            console.log(JSON.parse(body).Plot);
            console.log(JSON.parse(body).Actors);
        }
    });
}

function newSong(input){
    spotify.search({ type: 'track', query: input }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log(data.tracks.items[0].album.external_urls.spotify);
        console.log(data.tracks.items[0].album.name);
        console.log(data.tracks.items[0].album.artists[0].name);
        console.log(input.trim());
    });
}
