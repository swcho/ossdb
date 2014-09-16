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

});
