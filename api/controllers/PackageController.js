/**
 * PackageController
 *
 * @description :: Server-side logic for managing packages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../defs/ossdb.ts" />
var openhub = require('../services/OpenHubService');
module.exports = require("../services/PaginationController")();
var page = module.exports.page;
module.exports.page = function (req, res) {
    page(req, res, ['ossp', 'license']);
};
module.exports.searchInfo = function (req, res) {
    var id = req.param('id');
    var resp = {
        id: id,
        package: null,
        openhub: null
    };
    Package.findOne(id).exec(function (err, pkg) {
        console.log(pkg);
        resp.package = pkg;
        openhub.queryProject(pkg.name, function (result) {
            resp.openhub = result;
            res.json(resp);
        });
    });
};
//# sourceMappingURL=PackageController.js.map