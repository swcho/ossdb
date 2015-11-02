/// <reference path="../typings/tsd.d.ts" />

var Sails = require('sails');
import async = require('async');
import supertest = require('supertest');

var gSails;
before(function (done) {
	Sails.lift({
		environment: 'test'
	}, function (err, sails) {
		if (err) {
			return done(err);
		}

		gSails = sails;

		var ossdb = supertest.agent('http://localhost:1337');
		async.series([
			function (done) {
				ossdb.get('/user/create').query({
					name: 'Test',
					email: 'test@test.com',
					password: 'password'
				}).end(function(err, res) {
					done();
				});
			},
			function (done) {
				ossdb.post('/auth/login').send({
					email: 'test@test.com',
					password: 'password'
				}).end(function(err, res) {
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
