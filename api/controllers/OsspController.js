/**
 * OsspController
 *
 * @description :: Server-side logic for managing ossps
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

//var Ossp = require('../models/Ossp');

module.exports = {

    count: function(req, res) {
        Ossp.count().exec(function (err, count) {
            return res.json({
                count: count
            });
        });
    },

    page: function(req, res) {
        var no = parseInt(req.param('no'), 10) || 1;
        var limit = parseInt(req.param('limit'), 10) || 10;
        var sort = req.param('sort');
        console.log([no, limit, sort].join(', '));
        Ossp.find({}).skip(no * limit).limit(limit).sort(sort).exec(function findCB(err, found) {
            Ossp.count().exec(function (err, count) {
                res.json({
                    count: count,
                    items: found
                })
            });
        });
    }

};

