/**
 * Created by sungwoo on 14. 10. 22.
 */

var actionUtil          = require('sails/lib/hooks/blueprints/actionUtil');
var origCreateRecord    = require('sails/lib/hooks/blueprints/actions/create');

module.exports = function createRecord (req, res) {

    var model = req.options.model || req.options.controller;


    var Model = actionUtil.parseModel(req);

    // Create data object (monolithic combination of all parameters)
    // Omit the blacklisted params (like JSONP callback param, etc.)
    var data = actionUtil.parseValues(req);

    origCreateRecord(req, res);
};
