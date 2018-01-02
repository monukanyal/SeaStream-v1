const chai = require('chai'),
      chaiHttp = require('chai-http'),
      server = require('../../app'),
      should = chai.should(),
      db = require('../../config/db');

chai.use(chaiHttp);

describe('Movies Controller', () => {

  let accessToken;

  before((done) => {
    db.movies.remove({}, {multi:true}, () => {

      let joe = { name: 'joe', isAdmin: false };

      db.profiles.insert(joe, (err) => {
        if (err) {
          console.log(err);
        }
        chai.request(server)
          .get('/profiles/joe')
          .end((err, res) => {
            accessToken = res.body.data;
            done();
          });
      });
    });
  });

  after((done) => {
    db.profiles.remove({}, {multi:true}, () => {
      done();
    });
  });

  beforeEach((done) => {

    let testMovies = [
      { title: 'The Last Samurai', description: "This is an awesome film", released: new Date(2008, 1, 1), genres: ['Action', 'Drama'], cast: ['Tom Cruise', 'Ayato Hirowi']},
      { title: 'The Grudge', description: "This is a scary film", released: new Date(2012, 1, 1), genres: ['Horror'], cast: ['Michelle Gellar', 'Someone Else']},
      { title: 'The Hills Have Eyes', description: "This is another scary film", released: new Date(2013, 1, 1), genres: ['Horror', 'Adventure'], cast: ['Michelle Gellar', 'Someone Else']},
    ];

    db.movies.insert(testMovies, (err) => {
      if (err){
        console.log(err);
      }
      done();
    });
  });

  afterEach((done) => {
    db.movies.remove({}, {multi:true}, () => {
      done();
    });
  });

  it('should list some random movies on GET /movies', (done) => {
    chai.request(server)
      .get('/api/movies')
      .set('x-access-token', accessToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        done();
      });
  });

  it('should return a single movie on GET /movies/:id', (done) => {
    db.movies.insert({title: 'The Lord of the Rings: The Return of the King'}, (err, savedMovie) => {
      chai.request(server)
        .get('/api/movies/' + savedMovie._id)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body._id.should.equal(savedMovie._id);
          res.body.title.should.equal("The Lord of the Rings: The Return of the King");
          done();
        });
    });
  });

  it('should return BAD REQUEST on GET /movies/xyz', (done) => {
    chai.request(server)
      .get('/api/movies/xyz')
      .set('x-access-token', accessToken)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.error.should.equal("Bad Request");
        done();
      });
  });

  it('should return NOT FOUND on GET /movies/XW3oNaglDShyZF93', (done) => {
    chai.request(server)
      .get('/api/movies/XW3oNaglDShyZF93')
      .set('x-access-token', accessToken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.error.should.equal("Not Found");
        done();
      });
  });

  it('should return horror movies only on GET /movies/genre/horror', (done) => {
    chai.request(server)
      .get('/api/movies/genre/horror')
      .set('x-access-token', accessToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.length.should.equal(2);
        done();
      });
  });

  it('should return action movies only on GET /movies/genre/action', (done) => {
    chai.request(server)
      .get('/api/movies/genre/action')
      .set('x-access-token', accessToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.length.should.equal(1);
        res.body[0].title.should.equal('The Last Samurai');
        done();
      });
  });

  it('should return NOT FOUND on GET /movies/genre/xyz', (done) => {
    chai.request(server)
      .get('/api/movies/genre/xyz')
      .set('x-access-token', accessToken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.error.should.equal("Not Found");
        res.body.message.should.equal("No movies found for genre \"xyz\"");
        done();
      });
  });

  it('should return "The Grudge" on GET /movies/title/The Grudge', (done) => {
    chai.request(server)
      .get('/api/movies/title/the grudge')
      .set('x-access-token', accessToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.length.should.equal(1);
        res.body[0].title.should.equal('The Grudge');
        done();
      });
  });

  it('should return NOT FOUND on GET /movies/title/xyz', (done) => {
    chai.request(server)
      .get('/api/movies/title/xyz')
      .set('x-access-token', accessToken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.error.should.equal("Not Found");
        res.body.message.should.equal("No movies found with title containing \"xyz\"");
        done();
      });
  });

  it('should return "Movies with Tom Cruise" on GET /movies/cast/Tom Cruise', (done) => {
    chai.request(server)
      .get('/api/movies/cast/Tom Cruise')
      .set('x-access-token', accessToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.length.should.equal(1);
        res.body[0].title.should.equal('The Last Samurai');
        done();
      });
  });

  it('should return NOT FOUND on GET /movies/cast/xyz', (done) => {
    chai.request(server)
      .get('/api/movies/cast/xyz')
      .set('x-access-token', accessToken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.error.should.equal("Not Found");
        res.body.message.should.equal("No movies found by actor \"xyz\"");
        done();
      });
  });

  it('should return FORBIDDEN when trying to GET /api/movies', (done) => {
    chai.request(server)
      .get('/api/movies')
      .end((err, res) => {
        res.should.have.status(403);
        res.body.error.should.equal("Forbidden");
        done();
      });
  });

});