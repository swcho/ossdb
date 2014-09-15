
/// <reference path="../typings/tsd.d.ts" />

import openhub = require('../api/services/OpenHubService');
import chai = require('chai');
import supertest = require('supertest');

describe('Import', function() {

    var ossdb = supertest('http://localhost:1337');
    var osspId;

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
        console.log(url);
        ossdb.get(url)
            .end(function(err, res) {
                chai.expect(res.body.name).to.equal('avahi');
                chai.expect(res.body.projectUrl).to.equal('http://avahi.org');
                chai.expect(res.body.licenses).to.have.length(1);
                chai.expect(res.body.licenses[0].name).to.equal('GNU Library or "Lesser" GPL');
                chai.expect(res.body.licenses[0].shortName).to.equal('LGPL');
                done(err);
            });
    });

});
