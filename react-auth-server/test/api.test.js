let expect = require('chai').expect;
let chai = require('chai');
let request = require('superagent');

const devUrl = 'http://localhost:3001';

describe('API Tests', () => {
  describe('#events', () => {
    it('should get events list', (done) => {
      request.get(devUrl+'/api/events').end((err, res) => {
        chai.expect(err).to.not.be.ok;
        chai.expect(res.body).to.be.instanceof(Array);
        done();
      });
    });
    it('should have at least 1 event with proper schema', (done) => {
      request.get(devUrl+'/api/events').end((err, res) => {
        chai.expect(err).to.not.be.ok;
        chai.expect(res.body.length).to.be.above(0);
        chai.expect(res.body[0]).to.have.property('id');
        chai.expect(res.body[0]).to.have.property('name');
        chai.expect(res.body[0]).to.have.property('required');
        chai.expect(res.body[0]).to.have.property('type');
        chai.expect(res.body[0]).to.have.property('points_present');
        chai.expect(res.body[0]).to.have.property('points_missed');
        chai.expect(res.body[0]).to.have.property('when');
        done();
      });
    });
  });
});
