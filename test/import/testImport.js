/// <reference path="../../typings/tsd.d.ts" />
var chai = require('chai');
var supertest = require('supertest');
describe('Import', function () {
    var ossdb = supertest.agent('http://localhost:1337');
    var osspId;
    var licenseId;
    //it('create user', function(done) {
    //    ossdb.get('/user/create').query({
    //        name: 'Test',
    //        email: 'test@test.com',
    //        password: 'password'
    //    }).end(function(err, res) {
    //        done();
    //    });
    //});
    //
    it('login as admin', function (done) {
        ossdb.post('/auth/login').send({
            email: 'test@test.com',
            password: 'password'
        }).end(function (err, res) {
            done();
        });
    });
    //it('get login info', function(done) {
    //    ossdb.get('/auth/getInfo').end(function(err, res) {
    //        done();
    //    });
    //});
    it('import project', function (done) {
        ossdb.get('/ossp/importOpenHub').query({
            url: 'https://www.openhub.net/p/avahi'
        }).expect(200).end(function (err, res) {
            chai.expect(res.body.url).to.equal('https://www.openhub.net/p/avahi');
            chai.expect(res.body.project.name).to.equal('avahi');
            chai.expect(res.body.project.projectUrl).to.equal('http://avahi.org');
            osspId = res.body.project.id;
            done(err);
        });
    });
    it('has new project', function (done) {
        var url = '/ossp/' + osspId;
        ossdb.get(url).end(function (err, res) {
            console.log(res.body);
            chai.expect(res.body.name).to.equal('avahi');
            chai.expect(res.body.projectUrl).to.equal('http://avahi.org');
            chai.expect(res.body.licenses).to.have.length(1);
            chai.expect(res.body.licenses[0].name).to.equal('GNU Library or "Lesser" GPL');
            chai.expect(res.body.licenses[0].shortName).to.equal('LGPL');
            licenseId = res.body.licenses[0].id;
            done(err);
        });
    });
    it('import license', function (done) {
        ossdb.get('/license/importOpenHub').query({
            url: 'http://www.openhub.net/licenses/lgpl'
        }).expect(200).end(function (err, res) {
            console.log(res.body);
            chai.expect(res.body.license.id).to.equal(licenseId);
            done(err);
        });
    });
});
//# sourceMappingURL=testImport.js.map