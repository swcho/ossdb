/**
 * Created by sungwoo on 14. 9. 16.
 */

/// <reference path="../typings/tsd.d.ts" />

import chai = require('chai');
import supertest = require('supertest');

describe('change log', function() {

    var ossdb = supertest.agent('http://localhost:1337');

    var packageCommon = {
        name: 'Package common',
        type: 'lib'
    };
    var package2 = {
        name: 'Package 2',
        type: 'lib'
    };
    var package3 = {
        name: 'Package 3',
        type: 'lib'
    };


    var projectA = {
        projectId: 'projectA'
    };
    var projectB = {
        projectId: 'projectB',
        packageInfoList: [
            packageCommon,
            package2
        ]
    };
    var projectC = {
        projectId: 'projectC',
        packageInfoList: [
            packageCommon,
            package3
        ]
    };

    function assert_user(user) {
        chai.expect(user.name).to.equal('Test');
        chai.expect(user.email).to.equal('test@test.com');
        chai.expect(user.encryptedPassword).to.not.exist;
    }

    it('create user', function(done) {
        ossdb.get('/user/create').query({
            name: 'Test',
            email: 'test@test.com',
            password: 'password'
        }).end(function(err, res) {
            console.log(res.body);
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

});
