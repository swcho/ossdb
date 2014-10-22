/**
 * Created by sungwoo on 14. 10. 22.
 */

var actionUtil          = require('sails/lib/hooks/blueprints/actionUtil');
var origCreateRecord    = require('sails/lib/hooks/blueprints/actions/create');

module.exports = function createRecord (req, res) {

    var model = req.options.model || req.options.controller;
    var data = actionUtil.parseValues(req);

//    if (req.user) {
//        Log.create({
//            user: req.user.id,
//            controller: req.options.controller,
//            api: req.options.action,
//            data: data
//        }).exec(function(err, item) {
//
//            origCreateRecord(req, res);
//        });
//    } else {
//        origCreateRecord(req, res);
//    }

    origCreateRecord(req, res);

};
