/**
 * Created by sungwoo on 14. 10. 17.
 */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../defs/ossdb.ts" />

module.exports = require("../services/PaginationController")();
var page = module.exports.page;
module.exports.page = function (req, res) {
    page(req, res);
};
