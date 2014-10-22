/**
* Created by sungwoo on 14. 9. 16.
*/
/// <reference path="../typings/tsd.d.ts" />
var chai = require('chai');
var supertest = require('supertest');

describe('change log', function () {
    var ossdb = supertest.agent('http://localhost:1337');

    var user1 = {
        name: 'User 1',
        email: 'user@test.com',
        password: 'user1Password'
    };

    var ossp1 = {
        name: 'OSSP 1',
        description: 'OSSP 1 Description',
        projectUrl: 'http://ossp.org'
    };

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

    function assertUser(userResp, userFixture) {
        chai.expect(userResp.name).to.equal(userFixture.name);
        chai.expect(userResp.email).to.equal(userFixture.email);
        chai.expect(userResp.password).to.not.exist;
    }

    function assertOssp(osspResp, osspFixture) {
        chai.expect(osspResp.name).to.equal(osspFixture.name);
        chai.expect(osspResp.description).to.equal(osspFixture.description);
        chai.expect(osspResp.projectUrl).to.equal(osspFixture.projectUrl);
    }

    it('create user', function (done) {
        ossdb.get('/user/create').query(user1).end(function (err, res) {
            assertUser(res.body, user1);
            done();
        });
    });

    it('auth user', function (done) {
        ossdb.post('/auth/login').send({
            email: user1.email,
            password: user1.password
        }).end(function (err, res) {
            assertUser(res.body, user1);
            done();
        });
    });

    it('create new oss project', function (done) {
        ossdb.get('/ossp/create').query(ossp1).end(function (err, res) {
            assertOssp(res.body, ossp1);
            done();
        });
    });

    it('check log to be crated', function (done) {
        ossdb.get('/log').end(function (err, res) {
            console.log(res.body);
            chai.expect(res.body).to.be.length(1);
            assertUser(res.body[0].user, user1);
            done();
        });
    });
});
//# sourceMappingURL=testChangeLog.js.map
