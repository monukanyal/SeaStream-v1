const chai = require('chai'),
      chaiHttp = require('chai-http'),
      server = require('../../app'),
      should = chai.should(),
      db = require('../../config/db');

chai.use(chaiHttp);

describe('Shows Controller', () => {
  let accessToken;

  before(done => {
    db.shows.remove({}, { multi: true }, () => {
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

  after(done => {
    db.profiles.remove({}, { multi:true }, () => {
      done();
    });
  });

  beforeEach(done => {

    let testShows = [
      { title: '24', description: "This is an awesome show with Jack Bauer as CTU star", released: new Date(2008, 1, 1), genres: ['Action', 'Drama'], cast: ['Tom Cruise', 'Ayato Hirowi']},
      { title: 'Castle', description: "Novelist mystery writer Richard 'Rick' Castle...", released: new Date(2012, 1, 1), genres: ['Drama', 'Crime'], cast: ['Michelle Gellar', 'Someone Else']},
      { title: 'My Name is Earl', description: "This is very funny", released: new Date(2013, 1, 1), genres: ['Comedy'], cast: ['Michelle Gellar', 'Someone Else']},
    ];

    db.shows.insert(testShows, err => {
      if (err){
        console.log(err);
      }
      done();
    });
  });

  afterEach(done => {
    db.shows.remove({}, { multi:true }, () => {
      done();
    });
  });

  it('should list some random shows on GET /shows', done => {
    chai.request(server)
      .get('/api/shows')
      .set('x-access-token', accessToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        done();
      });
  });
});