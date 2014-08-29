/**
 * Created by sungwoo on 14. 8. 29.
 */

// https://gist.github.com/tarlepp/869165914c26d753dbd8
'use strict';

var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
    /**
     * Generic count action for controller.
     *
     * @param   {Request}   request
     * @param   {Response}  response
     */
    count: function(request, response) {
        var Model = actionUtil.parseModel(request);

        Model
            .count(actionUtil.parseCriteria(request))
            .exec(function found(error, count) {
                response.json({count: count});
            });
    },

    /**
     * Generic count action for controller.
     *
     * @param   {Request}   req
     * @param   {Response}  res
     */
    page: function(req, res) {
        var no = parseInt(req.param('no'), 10) || 1;
        var limit = parseInt(req.param('limit'), 10) || 10;
        var sort = req.param('sort');
        console.log([no, limit, sort].join(', '));
        var Model = actionUtil.parseModel(req);
        var criteria = actionUtil.parseCriteria(req);
        Model.find().skip((no - 1) * limit).limit(limit).sort(sort).exec(function findCB(err, found) {
            Model.count().exec(function (err, count) {
                res.json({
                    count: count,
                    items: found
                });
            });
        });
    }
};