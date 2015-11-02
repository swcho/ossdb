/**
 * Created by sungwoo on 14. 9. 16.
 */
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../defs/ossdb.ts" />
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var LdapStrategy = require('passport-ldapauth').Strategy;
var bcrypt = require('bcrypt');
passport.serializeUser(function (user, done) {
    //    console.log('serializeUser: id=' + user.id);
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    //    console.log('deserializeUser: id=' + id);
    User.findOne(id).exec(function (err, user) {
        done(err, user);
    });
});
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    User.findOne({
        email: email
    }).exec(function (err, user) {
        if (err || !user) {
            return done(null, err);
        }
        bcrypt.compare(password, user.encryptedPassword, function (err, res) {
            if (err) {
                return done(null, false, {
                    message: 'Invalid Password'
                });
            }
            return done(null, user);
        });
    });
}));
passport.use(new LdapStrategy({
    usernameField: 'uid',
    passwordField: 'password',
    server: {
        url: 'ldap://doroci-test:389',
        adminDn: 'cn=admin,dc=example,dc=com',
        adminPassword: 'humax@!',
        searchBase: 'dc=example,dc=com',
        searchFilter: '(uid={{username}})'
    }
}, function (user, done) {
    console.log('LdapStrategy');
    user.id = user.uid;
    delete user.userPassword;
    return done(null, user);
}));
exports.express = {
    customMiddleware: function (app) {
        //        console.log('express middleware for passport');
        app.use(passport.initialize());
        app.use(passport.session());
    }
};
//# sourceMappingURL=passport.js.map