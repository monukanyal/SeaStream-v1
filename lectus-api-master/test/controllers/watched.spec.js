const chai = require('chai'),
      chaiHttp = require('chai-http'),
      server = require('../../app'),
      should = chai.should(),
      db = require('../../config/db');

chai.use(chaiHttp);

describe('Watched Controller', () => {

  let accessToken;

  before((done) => {
    db.watched.remove({}, {multi:true});

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

  beforeEach((done) => {
    let testWatchedItems = [
      { watcher: 'joe', movie: { _id: 'XW3oNaglDShyZF93', title: 'The Lord of the Rings' }, date: new Date(2016, 12, 12) },
      { watcher: 'ben', movie: { _id: 'XW3oNaglDShyZF94', title: 'The Lord of War' }, date: new Date(2016, 12, 11) }
    ];

    db.watched.insert(testWatchedItems, (err) => {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  afterEach((done) => {
    db.watched.remove({}, {multi:true}, () => {
      done();
    });
  });

  after((done) => {
    db.profiles.remove({}, {multi:true}, () => {
      done();
    });
  });

  it('should list all of Joe\'s recently watched movies on GET /api/watched', (done) => {
    chai.request(server)
      .get('/api/watched')
      .set('x-access-token', accessToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(1);
        done();
      });
  });

  it('should create a new watched item on POST /api/watched', (done) => {
    chai.request(server)
      .post('/api/watched')
      .set('x-access-token', accessToken)
      .send({ item: { movie: { _id: "XW3oNalDShyZFd55",  title: "13 hours" } } })
      .end((err, res) => {
        res.should.have.status(201);
        res.should.be.json;
        done();
      });
  });

  it('should delete on DELETE /api/watched/{some id}', (done) => {
    var newItem = {
      watcher: 'joe',
      movie: { title: 'The Mechanic' }
    };

    db.watched.insert(newItem, (err, item) => {
      chai.request(server)
        .delete(`/api/watched/${item._id}`)
        .set('x-access-token', accessToken)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
  });

  it('should return NOT FOUND when trying to delete an item that does not exist on DELETE /api/watched/57baaa80b0c8a89b0246f25c', (done) => {
    chai.request(server)
      .delete('/api/watched/57baaa80b0c8a89b0246f25c')
      .set('x-access-token', accessToken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.error.should.equal("Not Found");
        done();
      });
  });

  it('should return FORBIDDEN when trying to GET /api/watched', (done) => {
    chai.request(server)
      .get('/api/watched')
      .end((err, res) => {
        res.should.have.status(403);
        res.body.error.should.equal("Forbidden");
        done();
      });
  });

});