/**
 * Created by sungwoo on 14. 9. 17.
 */

var actionUtil          = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.send(401, {
            message: 'Not authorized'
        });
    }
};
