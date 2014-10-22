/**
 * Created by sungwoo on 14. 9. 16.
 */

/// <reference path="../typings/tsd.d.ts" />

import chai = require('chai');
import supertest = require('supertest');

describe('change log', function() {

    var ossdb = supertest.agent('http://localhost:1337');

    var user1 = {
        name: 'User 1',
        email: 'user1@test.com',
        password: 'user1Password'
    };

    var user2 = {
        name: 'User 2',
        email: 'user2@test.com',
        password: 'user2Password'
    };


    var ossp1 = {
        name: 'OSSP 1',
        description: 'OSSP 1 Description',
        projectUrl: 'http://ossp.org'
    };

    var license1 = {
        name: 'License 1'
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

    it('create user', function(done) {
        ossdb.get('/user/create').query(user1).end(function(err, res) {
            assertUser(res.body, user1);
            done();
        });
    });

    it('auth user', function(done) {
        ossdb.post('/auth/login').send({
            email: user1.email,
            password: user1.password
        }).end(function(err, res) {
            assertUser(res.body, user1);
            done();
        });
    });

    var ossp1Id;
    it('create new oss project', function(done) {
        ossdb.get('/ossp/create').query(ossp1).end(function(err, res) {
            assertOssp(res.body, ossp1);
            ossp1Id = res.body.id;
            done();
        });
    });

    it('check log to be created', function(done) {
        ossdb.get('/log').end(function(err, res) {
            chai.expect(res.body).to.be.length(1);
            assertUser(res.body[0].user, user1);
            chai.expect(res.body[0].controller).to.equal('ossp');
            chai.expect(res.body[0].action).to.equal('create');
            done();
        });
    });

    it('crete new project', function(done) {
        ossdb.post('/project').send(projectA).end(function(err, res) {
            chai.expect(res.status).to.equal(200);
            done();
        });
    });

    it('check log to be created', function(done) {
        ossdb.get('/log').end(function(err, res) {
            chai.expect(res.body).to.be.length(2);
            assertUser(res.body[1].user, user1);
            chai.expect(res.body[1].controller).to.equal('project');
            chai.expect(res.body[1].action).to.equal('create');
            done();
        });
    });

    it('crete new license', function(done) {
        ossdb.post('/license').send(license1).end(function(err, res) {
            chai.expect(res.status).to.equal(200);
            done();
        });
    });

    it('check log to be created', function(done) {
        ossdb.get('/log').end(function(err, res) {
            chai.expect(res.body).to.be.length(3);
            assertUser(res.body[2].user, user1);
            chai.expect(res.body[2].controller).to.equal('license');
            chai.expect(res.body[2].action).to.equal('create');
            done();
        });
    });

    it('create user2', function(done) {
        ossdb.get('/user/create').query(user2).end(function(err, res) {
            assertUser(res.body, user2);
            done();
        });
    });

    it('auth user2', function(done) {
        ossdb.post('/auth/login').send({
            email: user2.email,
            password: user2.password
        }).end(function(err, res) {
            assertUser(res.body, user2);
            done();
        });
    });

    it('update oss project', function(done) {
        ossdb.put('/ossp/' + ossp1Id).query({
            projectUrl: 'http://newossp1.org'
        }).end(function(err, res) {
            done();
        });
    });

    it('check log to be created', function(done) {
        ossdb.get('/log').end(function(err, res) {
            console.log(res.body);
            chai.expect(res.body).to.be.length(4);
            assertUser(res.body[3].user, user2);
            chai.expect(res.body[3].controller).to.equal('ossp');
            chai.expect(res.body[3].action).to.equal('update');
            done();
        });
    });

});
