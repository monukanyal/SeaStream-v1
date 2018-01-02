const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const MovieRepository = require('../../repositories/movie-repository');

describe('Movie Repository', () => {

  let movieRepository = {};

  beforeEach((done) => {
    movieRepository = new MovieRepository();
    done();
  });

  describe('selectRandomMovies function', () => {

    it('should iterate over all genres in the genre collection', (done) => {
      let genreCollection = [
        { genre: "Action", movies: ["Movie1", "Movie2", "Movie4", "Movie6", "Movie7", "Movie10"] },
        { genre: "Horror", movies: ["Movie2", "Movie3", "Movie33", "Movie6", "Movie42"] },
        { genre: "Western", movies: ["Movie43", "Movie23", "Movie33", "Movie23"] }
      ];

      let sortedList = movieRepository.selectRandomMovies(genreCollection);
      sortedList.length.should.equal(3);

      done();
    });

    it('should return all movies in genre if count smaller than movieToDisplaySetting', (done) => {

      let genreCollection = [
        { genre: "Action", movies: ["Movie1", "Movie2", "Movie4", "Movie6", "Movie7", "Movie10"] },
        { genre: "Horror", movies: ["Movie2", "Movie3", "Movie33", "Movie6", "Movie42"] },
        { genre: "Western", movies: ["Movie43", "Movie23", "Movie33", "Movie23"] }
      ];

      let sortedList = movieRepository.selectRandomMovies(genreCollection);
      sortedList[0].movies.length.should.equal(5);
      sortedList[1].movies.length.should.equal(5);
      sortedList[2].movies.length.should.equal(4);

      done();
    });

    it('should return empty array if no movies in genre', (done) => {

      let genreCollection = [
        { genre: "Romance", movies: [] }
      ];

      let sortedList = movieRepository.selectRandomMovies(genreCollection);
      sortedList[0].movies.length.should.equal(0);

      done();
    });

    it('should return distinct movies per genre', (done) => {
      let genreCollection = [
        { genre: "Action", movies: ["Movie1", "Movie2", "Movie4", "Movie6", "Movie7", "Movie10"] },
        { genre: "Horror", movies: ["Movie2", "Movie3", "Movie33", "Movie6", "Movie42"] },
        { genre: "Western", movies: ["Movie43", "Movie23", "Movie33", "Movie26"] }
      ];

      let sortedList = movieRepository.selectRandomMovies(genreCollection);
      sortedList.map((collection) => {
        collection.movies.map((movie) => {
          assert(collection.movies.indexOf(movie) == collection.movies.lastIndexOf(movie), 'The movie ' + movie +
           'exists twice in ' + collection.genre + ' ' + collection.movies + ' index: ' +
           collection.movies.indexOf(movie) + ' lastIndex: ' + collection.movies.lastIndexOf(movie));
        });
      });

      done();
    })

  });

});