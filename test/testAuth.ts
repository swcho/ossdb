/**
 * Created by sungwoo on 14. 9. 16.
 */

/// <reference path="../typings/tsd.d.ts" />

import chai = require('chai');
import supertest = require('supertest');

describe('auth', function() {

    var ossdb = supertest.agent('http://localhost:1337');

    function assert_user(user) {
        chai.expect(user.name).to.equal('Test');
        chai.expect(user.email).to.equal('test@test.com');
        chai.expect(user.encryptedPassword).to.not.exist;
    }

    it('has no user', function(done) {
        ossdb.get('/user').end(function(err, res) {
            console.log(res.body);
            chai.expect(res.unauthorized).to.be.true;
            done();
        });
    });

    it('create user', function(done) {
        ossdb.get('/user/create').query({
            name: 'Test',
            email: 'test@test.com',
            password: 'password'
        }).end(function(err, res) {
            assert_user(res.body);
            done();
        });
    });

    it('auth user', function(done) {
        ossdb.post('/auth/login').send({
            email: 'test@test.com',
            password: 'password'
        }).end(function(err, res) {
            assert_user(res.body);
            done();
        });
    });

    it('get login info', function(done) {
        ossdb.get('/auth/getInfo').end(function(err, res) {
            assert_user(res.body);
            done();
        });
    });

    it('has no user', function(done) {
        ossdb.get('/user').end(function(err, res) {
            chai.expect(res.unauthorized).to.be.false;
            assert_user(res.body[0]);
            done();
        });
    });

});
