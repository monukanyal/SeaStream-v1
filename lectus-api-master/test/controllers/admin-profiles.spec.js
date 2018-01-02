const chai = require('chai'),
      chaiHttp = require('chai-http'),
      server = require('../../app'),
      should = chai.should(),
      db = require('../../config/db');

chai.use(chaiHttp);

describe('Admin Profiles Controller', () => {

  let accessToken;

  before((done) => {

    db.profiles.remove({}, {multi: true}, (err) => {
      if (err) {
        console.log(err);
      } else {
        let profiles = [
          { name: 'Tim', isAdmin: true },
          { name: 'Sue', isAdmin: false },
          { name: 'Ben', isAdmin: false }
        ];

        db.profiles.insert(profiles, (err) => {
          if (err) {
            console.log(err);
          }

          chai.request(server)
            .get('/profiles/tim')
            .end((err, res) => {
              accessToken = res.body.data;
              done();
            });
        });
      }
    });
  });

  after((done) => {
    db.profiles.remove({}, {multi: true}, () => {
      done();
    });
  });

  it('should add a user on POST /api/admin/profiles', (done) => {
    chai.request(server)
      .post('/api/admin/profiles')
      .set('x-access-token', accessToken)
      .send({profile: {name: 'jim', isAdmin: false}})
      .end((err, res) => {
        res.should.have.status(204);
        done();
      });
  });

  it('should delete user joe on DELETE /api/admin/profiles/sue', (done) => {
    chai.request(server)
      .delete('/api/admin/profiles/sue')
      .set('x-access-token', accessToken)
      .end((err, res) => {
        res.should.have.status(204);
        done();
      });
  });

  it('should return BAD REQUEST on POST /api/admin/profiles with name less than 2 characters', (done) => {
    chai.request(server)
      .post('/api/admin/profiles')
      .set('x-access-token', accessToken)
      .send({profile: {name: 'a', isAdmin: false}})
      .end((err, res) => {
        res.should.have.status(400);
        res.body.error.should.equal("Bad Request");
        done();
      });
  });

  it('should return BAD REQUEST on POST /api/admin/profiles with name more than 15 characters', (done) => {
    chai.request(server)
      .post('/api/admin/profiles')
      .set('x-access-token', accessToken)
      .send({profile: {name: 'morethanfifteencharacterslong', isAdmin: false}})
      .end((err, res) => {
        res.should.have.status(400);
        res.body.error.should.equal("Bad Request");
        done();
      });
  });


  it('should return NOT FOUND on DELETE /api/admin/profiles/timmy', (done) => {
    chai.request(server)
      .delete('/api/admin/profiles/timmy')
      .set('x-access-token', accessToken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.error.should.equal("Not Found");
        done();
      });
  });

  it('should return FORBIDDEN when logged in as a non admin user on DELETE /api/admin/profiles/joe', (done) => {
    chai.request(server)
      .get('/profiles/ben')
      .end((err, res) => {
        accessToken = res.body.data;
        chai.request(server)
          .delete('/api/admin/profiles/joe')
          .set('x-access-token', accessToken)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.error.should.equal("Forbidden");
            done();
          });
      });
  });

});