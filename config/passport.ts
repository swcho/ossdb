/**
 * Created by sungwoo on 14. 9. 16.
 */

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../defs/ossdb.ts" />

import passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
    console.log('serializeUser: id=' + user[0].id);
    console.log(user);
    done(null, user[0].id);
});

passport.deserializeUser(function(id, done) {
    console.log('deserializeUser: id=' + id);
    User.findOne(id).exec(function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(function(email, password, done) {
    User.findOne({
        email: email
    }).exec(function(err, user) {
        if (err) {
            return done(null, err);
        }

        bcrypt.compare(password, user[0].encryptedPassword, function(err, res) {
            if (err) {
                return done(null, false, {
                    message: 'Invalid Password'
                });
            }

            return done(null, user);
        })
    });
}));

export var express = {
    customMiddleware: function(app) {
        console.log('express middleware for passport');
        app.use(passport.initialize());
        app.use(passport.session());
    }
};
