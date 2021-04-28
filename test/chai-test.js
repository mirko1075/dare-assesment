// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const assert = chai.assert;
const should = chai.should();
const expect = chai.expect;
const request = require('supertest')(app);


// Configure chai
chai.use(chaiHttp);
chai.Should();
describe("Get Data", () => {
    let auth = {};
    before(loginUser(auth));

    describe("GET /clients", () => {
        // Test to get all clients record
        it("should get all clients record", (done) => {
             chai.request(app)
                 .get('/api/clients')
                 .set('Authorization', 'bearer ' + auth.token)
                 .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.be.a('array');
                    res.body.length.should.be.gt(0);
                    done();
                  });
         });
    });

	describe("GET /policies", () => {
        // Test to get all policies record
        it("should get all policies record", (done) => {
             chai.request(app)
                 .get('/api/policies')
                 .set('Authorization', 'bearer ' + auth.token)
                 .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.be.a('array');
                    res.body.length.should.be.gt(0);
                     done();
                  });
         });
    });

 
});

function loginUser(auth) {
    return function(done) {
        request
            .post('/auth/login')
            .send({
                "client_id": "dare",
                "client_secret": "s3cr3t"
              })
            .expect(200)
            .end(onResponse);

        function onResponse(err, res) {
            auth.token = res.body.user.token;
            return done();
        }
    };
};