const chai = require('chai'),
      chaiHttp = require('chai-http'),
      server = require('../../app'),
      should = chai.should(),
      db = require('../../config/db');

chai.use(chaiHttp);

describe('Profiles Controller', () => {

  before((done) => {
    let testProfiles = [
      { name: 'Melisa', isAdmin: true },
      { name: 'Ben', isAdmin: false }
    ];

    db.profiles.insert(testProfiles, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      done();
    });
  });

  after((done) => {
    db.profiles.remove({}, {multi:true}, () => {
      done();
    });
  });


  it('should list all profiles on GET /profiles', (done) => {
    chai.request(server)
      .get('/profiles')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.length.should.equal(2);
        done();
      })
  });

  it('should return a jwt on successful login on GET /profiles/melisa', (done) => {
    chai.request(server)
      .get('/profiles/melisa')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        done();
      });
  });

  it('should return NOT FOUND on GET /profiles/hobbit', (done) => {
    chai.request(server)
      .get('/profiles/hobbit')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.error.should.equal("Not Found");
        done();
      });
  });

});