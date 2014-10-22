/**
 * Created by sungwoo on 14. 9. 17.
 */

var actionUtil          = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    Log.create({
        user: req.user.id,
        controller: req.options.controller,
        action: req.options.action,
        data: actionUtil.parseValues(req)
    }).exec(function(err, item) {
        next();
    });
};
