/**
* Created by sungwoo on 14. 9. 16.
*/
/// <reference path="../typings/tsd.d.ts" />
var chai = require('chai');
var supertest = require('supertest');

describe('auth', function () {
    var ossdb = supertest.agent('http://localhost:1337');

    it('has no user', function (done) {
        ossdb.get('/user').end(function (err, res) {
            console.log(res.body);
            done();
        });
    });

    it('create user', function (done) {
        ossdb.get('/user/create').query({
            name: 'Test',
            email: 'test@test.com',
            password: 'password'
        }).end(function (err, res) {
            chai.expect(res.body.name).to.equal('Test');
            chai.expect(res.body.email).to.equal('test@test.com');
            chai.expect(res.body.encryptedPassword).to.not.exist;
            console.log(res.header['set-cookie']);
            done();
        });
    });

    it('auth user', function (done) {
        ossdb.post('/auth/login').send({
            email: 'test@test.com',
            password: 'password'
        }).end(function (err, res) {
            console.log(res.body);
            console.log(res.header['set-cookie']);
            done();
        });
    });

    it('get login info', function (done) {
        ossdb.get('/auth/getInfo').end(function (err, res) {
            done();
        });
    });
});
//# sourceMappingURL=testAuth.js.map
