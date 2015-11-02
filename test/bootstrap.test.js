/// <reference path="../typings/tsd.d.ts" />
var Sails = require('sails');
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
        done(err);
    });
});
after(function (done) {
    gSails.lower(done);
});
//# sourceMappingURL=bootstrap.test.js.map