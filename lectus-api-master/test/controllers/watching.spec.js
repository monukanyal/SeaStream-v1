const chai = require('chai'),
      chaiHttp = require('chai-http'),
      server = require('../../app'),
      should = chai.should(),
      db = require('../../config/db');

chai.use(chaiHttp);

describe('Watching Controller', () => {

  let accessToken;

  before((done) => {
    db.watching.remove({}, {multi:true}, () => {
      let joe = { name: 'joe', isAdmin: false };

      db.profiles.insert(joe, () => {
        chai.request(server)
          .get('/profiles/joe')
          .end((err, res) => {
            accessToken = res.body.data;
            done();
          });
      });
    });
  });


  beforeEach((done) => {
    let testWatchings = [
      { watcher: 'joe', movie: { _id: 'XW3oNaglDShyZF93', title: 'The Lord of the Rings' }, time: 44 },
      { watcher: 'ben', movie: { _id: 'XW3oNaglDShyZF94', title: 'The Lord of War' }, time: 73 }
    ];

    db.watching.insert(testWatchings, (err) => {
      if (err) {
        console.log(err);
      }

      done()
    });
  });

  afterEach((done) => {
    db.watching.remove({}, {multi:true}, () => {
      done();
    });
  });

  after((done) => {
    db.profiles.remove({}, {multi:true}, () => {
      done();
    });
  });

  it('should list all of Joe\'s continue watching movies on GET /api/watching', (done) => {
    chai.request(server)
      .get('/api/watching')
      .set('x-access-token', accessToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(1);
        done();
      });
  });

  it('should return a single continue watching item on GET /api/watching/{some movieId}', (done) => {
    var newItem = {
      watcher: 'joe',
      movie: { _id: 'mFwNZfvEE27EuKWX', title: 'The Mechanic' },
      time: 58
    };

    db.watching.insert(newItem, (err, item) => {
      chai.request(server)
        .get('/api/watching/mFwNZfvEE27EuKWX')
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.time.should.equal(58);
          done();
        });
    });
  });

  it('should return BAD REQUEST on GET /api/watching/xyz', (done) => {
    chai.request(server)
      .get('/api/watching/xyz')
      .set('x-access-token', accessToken)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.error.should.equal("Bad Request");
        done();
      });
  });

  it('should return empty response if a watched item is not found', (done) => {
    chai.request(server)
      .get('/api/watching/XW3oIerlDShyZF93')
      .set('x-access-token', accessToken)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should update a watching on POST with same watcher and movieId ', (done) => {
    var newItem = {
      watcher: 'joe',
      movie: { _id: 'mFwNZfvEE27EuKZZ', title: 'Coming 2 America' },
      time: 58
    };

    db.watching.insert(newItem, (err, item) => {
      chai.request(server)
        .post(`/api/watching`)
        .set('x-access-token', accessToken)
        .send({ item: { movie: { _id: 'mFwNZfvEE27EuKZZ', title: 'Coming 2 America'}, time : 1532.2655 } })
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
  });

  it('should create a new watching on POST /api/watching', (done) => {
    chai.request(server)
      .post('/api/watching')
      .set('x-access-token', accessToken)
      .send({ item: { movie: { _id: 'XW3oNalDShyZFd93', title: 'The Grudge' }, time: 82 } })
      .end((err, res) => {
        res.should.have.status(204);
        done();
      });
  });

  it('should delete on DELETE /api/watching/{some id}', (done) => {
    var newItem = {
      watcher: 'joe',
      movie: { _id: 'mFwNZfvEE27EuKZZ', title: 'The Hurtlocker '},
      time: 58
    };

    db.watching.insert(newItem, (err, item) => {
      chai.request(server)
        .delete('/api/watching/mFwNZfvEE27EuKZZ')
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
  });

  it('should return NOT FOUND when trying to delete an item that does not exist on DELETE /api/watching/XW3oNaglDShyZA93', (done) => {
    chai.request(server)
      .delete('/api/watching/XW3oNaglDShyZA93')
      .set('x-access-token', accessToken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.error.should.equal("Not Found");
        done();
      });
  });

  it('should return FORBIDDEN when trying to GET /api/watching', (done) => {
    chai.request(server)
      .get('/api/watching')
      .end((err, res) => {
        res.should.have.status(403);
        res.body.error.should.equal("Forbidden");
        done();
      });
  });

});