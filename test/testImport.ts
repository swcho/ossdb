
/// <reference path="../typings/tsd.d.ts" />

import openhub = require('../api/services/OpenHubService');
import chai = require('chai');
import supertest = require('supertest');

describe('Import', function() {

    it('import project', function(done) {
        supertest('http://localhost:1337')
            .get('/ossp/importOpenHub')
            .query({
                url: 'http://www.openhub.net/p/avahi'
            })
            .expect(200)
            .end(function(err, res) {
//                console.log(res.body);
//                console.log(res.body.url);
                done(err);
            });
    });


});