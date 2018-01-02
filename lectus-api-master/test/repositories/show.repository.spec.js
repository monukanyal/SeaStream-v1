const chai = require('chai'),
      should = chai.should(),
      assert = chai.assert,
      ShowRepository = require('../../repositories/show.repository');

describe('Show Repository', () => {
  let showRepository = {};

  beforeEach(done => {
    showRepository = new ShowRepository();
    done();
  });

  describe('selectRandomShows function', () => {
    it('should iterate over all genres in the genre collection', done => {
      let genreCollection = [
        { genre: "Action", shows: ["Show1", "Show2", "Show4", "Show6", "Show7", "Show10"] },
        { genre: "Horror", shows: ["Show2", "Show3", "Show33", "Show6", "Show42"] },
        { genre: "Western", shows: ["Show43", "Show23", "Show33", "Show23"] }
      ];

      let sortedList = showRepository.selectRandomShows(genreCollection);
      sortedList.length.should.equal(3);
      done();
    });

    it('should return all shows in genre if count smaller than showsToDisplaySetting', done => {
      let genreCollection = [
        { genre: "Action", shows: ["Show1", "Show2", "Show4", "Show6", "Show7", "Show10"] },
        { genre: "Horror", shows: ["Show2", "Show3", "Show33", "Show6", "Show42"] },
        { genre: "Western", shows: ["Show43", "Show23", "Show33", "Show23"] }
      ];

      let sortedList = showRepository.selectRandomShows(genreCollection);
      sortedList[0].shows.length.should.equal(5);
      sortedList[1].shows.length.should.equal(5);
      sortedList[2].shows.length.should.equal(4);

      done();
    });

    it('should return empty array if no shows in genre', done => {

      let genreCollection = [
        { genre: "Romance", shows: [] }
      ];

      let sortedList = showRepository.selectRandomShows(genreCollection);
      sortedList[0].shows.length.should.equal(0);

      done();
    });

    it('should return distinct shows per genre', done => {
      let genreCollection = [
        { genre: "Action", shows: ["Show1", "Show2", "Show4", "Show6", "Show7", "Show10"] },
        { genre: "Horror", shows: ["Show2", "Show3", "Show33", "Show6", "Show42"] },
        { genre: "Western", shows: ["Show43", "Show23", "Show33", "Show26"] }
      ];

      let sortedList = showRepository.selectRandomShows(genreCollection);
      sortedList.map((collection) => {
        collection.shows.map(show => {
          assert(collection.shows.indexOf(show) == collection.shows.lastIndexOf(show), 'The show ' + show +
            'exists twice in ' + collection.genre + ' ' + collection.shows + ' index: ' +
            collection.shows.indexOf(show) + ' lastIndex: ' + collection.shows.lastIndexOf(show));
        });
      });

      done();
    })
  });
});