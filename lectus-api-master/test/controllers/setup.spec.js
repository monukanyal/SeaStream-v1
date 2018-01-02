const chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../../app'),
  should = chai.should(),
  db = require('../../config/db');

chai.use(chaiHttp);

describe('Setup Controller', () => {

  after((done) => {
    db.profiles.remove({}, () => {
      done();
    })
  });

  it('should create a new admin profile on POST /setup/profile', (done) => {
    chai.request(server)
      .post('/setup/profile')
      .send({ profile: { name: 'Ben' } })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.name.should.equal('Ben');
        res.body.isAdmin.should.equal(true);
        done();
      });
  });

  it('should return FORBIDDEN if an admin profile already exists on POST /setup/profile', (done) => {
    db.profiles.insert({name: 'Sue', isAdmin: true}, () => {
      chai.request(server)
        .post('/setup/profile')
        .send({profile: {name: 'Ben'}})
        .end((err, res) => {
          res.should.have.status(403);
          res.body.error.should.equal("Forbidden");
          done();
        });
    });
  });

});