/**
 * Created by sungwoo on 14. 9. 17.
 */

module.exports = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.send(401, {
            message: 'Not authorized'
        });
    }
};
