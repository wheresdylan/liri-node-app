console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.bandsInTown = process.env.BANDS_IN_TOWN;

exports.omdb = process.env.OMDB_API_KEY;