/**
 * Created by sungwoo on 14. 9. 16.
 */

/// <reference path="../../typings/tsd.d.ts" />

import chai = require('chai');
import supertest = require('supertest');

describe('project submit', function() {

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

    it('submit common packages', function(done) {
        ossdb.post('/package').send(packageCommon).end(function(err, res) {
            chai.expect(res.status).to.equal(200);
            console.log(res.body);
            done();
        });
    });

});
