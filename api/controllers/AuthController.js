/**
 * Created by sungwoo on 14. 9. 16.
 */
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../defs/ossdb.ts" />
var passport = require('passport');
//export function login(req, res) {
//    res.view("auth/login");
//}
function login(req, res, next) {
    var email = req.param('email');
    var password = req.param('password');
    passport.authenticate('local', function (err, user, info) {
        if (err || !user) {
            res.send(403, {
                message: 'login failed'
            });
            return;
        }
        req.logIn(user, function (err) {
            if (err) {
                res.send(403, {
                    message: 'invalid password'
                });
                return;
            }
            res.json(user);
        });
    })(req, res, next);
}
exports.login = login;
function loginLDAP(req, res, next) {
    var uid = req.param('uid');
    var password = req.param('password');
    passport.authenticate('ldapauth', function (err, user, info) {
        if (err || !user) {
            res.send(403, {
                message: 'login failed'
            });
            return;
        }
        req.logIn(user, function (err) {
            if (err) {
                res.send(403, {
                    message: 'invalid password'
                });
                return;
            }
            res.json(user);
        });
    })(req, res, next);
}
exports.loginLDAP = loginLDAP;
function getInfo(req, res) {
    //    console.log('getInfo');
    //    console.log(req.user);
    if (req.isAuthenticated()) {
        res.json(req.user);
    }
    else {
        res.send(403, {
            message: 'Not authorized'
        });
    }
}
exports.getInfo = getInfo;
function logout(req, res) {
    req.logout();
    res.send('logout successful');
}
exports.logout = logout;
//# sourceMappingURL=AuthController.js.map