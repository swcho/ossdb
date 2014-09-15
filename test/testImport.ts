
/// <reference path="../typings/tsd.d.ts" />

import openhub = require('../api/services/OpenHubService');
import chai = require('chai');
import supertest = require('supertest');

describe('Import', function() {

    var ossdb = supertest('http://localhost:1337');
    var osspId;
    var licenseId;

    it('import project', function(done) {
        ossdb.get('/ossp/importOpenHub')
            .query({
                url: 'http://www.openhub.net/p/avahi'
            })
            .expect(200)
            .end(function(err, res) {
                chai.expect(res.body.url).to.equal('http://www.openhub.net/p/avahi');
                chai.expect(res.body.project.name).to.equal('avahi');
                chai.expect(res.body.project.projectUrl).to.equal('http://avahi.org');
                osspId = res.body.project.id;
                done(err);
            });
    });

    it('has new project', function(done) {
        var url = '/ossp/' + osspId;
        ossdb.get(url)
            .end(function(err, res) {
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

    it('import license', function(done) {
        ossdb.get('/license/importOpenHub')
            .query({
                url: 'http://www.openhub.net/licenses/lgpl'
            })
            .expect(200)
            .end(function(err, res) {
                console.log(res.body);
                chai.expect(res.body.license.id).to.equal(licenseId);
                done(err);
            });
    });

});
