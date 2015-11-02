/// <reference path="../typings/tsd.d.ts" />
var Sails = require('sails');
var async = require('async');
var supertest = require('supertest');
var gSails;
before(function (done) {
    Sails.lift({
        log: {
            level: 'error'
        },
        environment: 'test'
    }, function (err, sails) {
        if (err) {
            return done(err);
        }
        //        barrels.populate(function(err) {
        //            done(err, sails);
        //        });
        //
        //        fixtures = barrels.objects
        gSails = sails;
        var ossdb = supertest('http://localhost:1337');
        async.series([
            function (done) {
                ossdb.get('/user/create').query({
                    name: 'Test',
                    email: 'test@test.com',
                    password: 'password'
                }).end(function (err, res) {
                    done();
                });
            },
            function (done) {
                ossdb.post('/auth/login').send({
                    email: 'test@test.com',
                    password: 'password'
                }).end(function (err, res) {
                    done();
                });
            }
        ], function (err) {
            done(err);
        });
    });
});
after(function (done) {
    gSails.lower(done);
});
//# sourceMappingURL=bootstrap.test_admin.js.map