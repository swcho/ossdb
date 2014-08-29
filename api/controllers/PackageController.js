/**
 * PackageController
 *
 * @description :: Server-side logic for managing packages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = require("../services/PaginationController")();
var page = module.exports.page;
module.exports.page = function (req, res) {
    page(req, res, ['ossp', 'license']);
};