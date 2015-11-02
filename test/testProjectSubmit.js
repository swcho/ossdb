/**
 * Created by sungwoo on 14. 9. 16.
 */
/// <reference path="../typings/tsd.d.ts" />
var chai = require('chai');
var supertest = require('supertest');
describe('project submit', function () {
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
    it('create user', function (done) {
        ossdb.get('/user/create').query({
            name: 'Test',
            email: 'test@test.com',
            password: 'password'
        }).end(function (err, res) {
            assert_user(res.body);
            done();
        });
    });
    it('auth user', function (done) {
        ossdb.post('/auth/login').send({
            email: 'test@test.com',
            password: 'password'
        }).end(function (err, res) {
            assert_user(res.body);
            done();
        });
    });
    it('submit project without id', function (done) {
        ossdb.post('/project/setProjectWithPackages/').send({}).end(function (err, res) {
            chai.expect(res.status).to.equal(400);
            done();
        });
    });
    it('submit Project A only id', function (done) {
        ossdb.post('/project/setProjectWithPackages').send(projectA).end(function (err, res) {
            chai.expect(res.status).to.equal(200);
            chai.expect(res.body.ok).to.true;
            chai.expect(res.body.projectAdded).to.true;
            chai.expect(res.body.packageNamesCreated).is.length(0);
            chai.expect(res.body.packageNamesAdded).is.length(0);
            chai.expect(res.body.packageNamesRemoved).is.length(0);
            done();
        });
    });
    it('submit Project B with packages', function (done) {
        ossdb.post('/project/setProjectWithPackages').send(projectB).end(function (err, res) {
            chai.expect(res.status).to.equal(200);
            chai.expect(res.body.ok).to.true;
            chai.expect(res.body.projectAdded).to.true;
            chai.expect(res.body.packageNamesCreated).is.length(2);
            chai.expect(res.body.packageNamesAdded).is.length(2);
            chai.expect(res.body.packageNamesRemoved).is.length(0);
            done();
        });
    });
    it('submit Project C with packages', function (done) {
        ossdb.post('/project/setProjectWithPackages').send(projectC).end(function (err, res) {
            chai.expect(res.status).to.equal(200);
            chai.expect(res.body.ok).to.true;
            chai.expect(res.body.projectAdded).to.true;
            chai.expect(res.body.packageNamesCreated).is.length(1);
            chai.expect(res.body.packageNamesAdded).is.length(2);
            chai.expect(res.body.packageNamesRemoved).is.length(0);
            done();
        });
    });
    it('check project list', function (done) {
        ossdb.get('/project').end(function (err, res) {
            chai.expect(res.status).to.equal(200);
            //            console.log(res.body);
            chai.expect(res.body).is.length(3);
            var projects = [
                projectA,
                projectB,
                projectC
            ];
            res.body.forEach(function (p, i) {
                var fp = projects[i];
                chai.expect(p.projectId).to.equal(fp.projectId);
            });
            done();
        });
    });
    it('check submit list', function (done) {
        ossdb.get('/ProjectSubmit').end(function (err, res) {
            console.log(res.body);
            chai.expect(res.body).is.length(3);
            res.body.forEach(function (submitInfo) {
                chai.expect(submitInfo.user.name).to.equal('Test');
            });
            done();
        });
    });
});
//# sourceMappingURL=testProjectSubmit.js.map