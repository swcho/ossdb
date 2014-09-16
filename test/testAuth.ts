/**
 * Created by sungwoo on 14. 9. 16.
 */

/// <reference path="../typings/tsd.d.ts" />

import chai = require('chai');
import supertest = require('supertest');

describe('auth', function() {

    var ossdb = supertest('http://localhost:1337');

    it('has no user', function(done) {
        ossdb.get('/user').end(function(err, res) {
            console.log(res.body);
            done();
        });
    });

    it('create user', function(done) {
        ossdb.get('/user/create').query({
            name: 'Test',
            email: 'test@test.com',
            password: 'password'
        }).end(function(err, res) {
            chai.expect(res.body.name).to.equal('Test');
            chai.expect(res.body.email).to.equal('test@test.com');
            chai.expect(res.body.encryptedPassword).to.not.exist;
            done();
        });
    });

});
