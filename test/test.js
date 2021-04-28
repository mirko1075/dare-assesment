'use strict';
let app = require('../app');
var request = require('supertest')(app);


describe('Testing the app', function() {

    var auth = {};
    before(loginUser(auth));


    it('Should get the policies', function(done) {
        request
            .get('/api/policies')
            .set('Authorization', 'bearer ' + auth.token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Should get the clients', function(done) {
    request
        .get('/api/clients')
        .set('Authorization', 'bearer ' + auth.token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
            if (err) return done(err);
            done();
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
}