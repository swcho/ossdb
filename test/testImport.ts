
/// <reference path="../typings/tsd.d.ts" />

import openhub = require('../api/services/OpenHubService');
import chai = require('chai');
import supertest = require('supertest');

describe('Import', function() {

    it('import project', function(done) {
        console.log('import project');
        supertest('http://localhost:1337')
            .get('/project/importOpenHub')
            .expect(200)
            .end(function(err, res) {
                console.log(res);
                done(err);
            });
    });


});