/**
 * Created by sungwoo on 14. 8. 29.
 */

// https://gist.github.com/tarlepp/869165914c26d753dbd8
'use strict';

var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = function () {
    return {
        count: function(request, response) {
            var Model = actionUtil.parseModel(request);

            Model
                .count(actionUtil.parseCriteria(request))
                .exec(function found(error, count) {
                    response.json({count: count});
                });
        },

        page: function(req, res, populateList) {
            var no = parseInt(req.param('no'), 10) || 1;
            var limit = parseInt(req.param('limit'), 10) || 10;
            var sort = req.param('sort');
            console.log([no, limit, sort].join(', '));
            var Model = actionUtil.parseModel(req);
            var criteria = actionUtil.parseCriteria(req);
            var q = Model.find();
            if (populateList && populateList.forEach) {
                populateList.forEach(function(key) {
                    q.populate(key);
                });
            }
            q.skip((no - 1) * limit).limit(limit).sort(sort).exec(function findCB(err, found) {

                console.log(err);

                Model.count().exec(function (err, count) {
                    res.json({
                        count: count,
                        items: found
                    });
                });
            });
        },

        hi: function (req, res) {
            res.json({
                message: 'hi'
            });
        }
    };
};