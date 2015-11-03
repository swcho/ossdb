/**
 * Created by sungwoo on 14. 9. 15.
 */
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../defs/ossdb.ts" />
var OpenHubService = require('../services/OpenHubService');
var async = require('async');
module.exports = require("../services/PaginationController")();
module.exports.getAll = function (req, res) {
    Ossp.find({}).exec(function (err, items) {
        res.send(items);
    });
};
module.exports.importOpenHub = function (req, res) {
    var url = req.param('url');
    var resp = {
        url: url,
        projectInfo: null,
        project: null
    };
    OpenHubService.getProjectInfo(url, function (err, projectInfo) {
        var series = [];
        var licenseIds = [];
        resp.projectInfo = projectInfo;
        projectInfo.licenses.forEach(function (licenseInfo) {
            series.push(function (cb) {
                License.findOrCreate({
                    name: licenseInfo.name
                }, {
                    name: licenseInfo.name,
                    shortName: licenseInfo.abbreviation,
                    description: licenseInfo.licenseText,
                    url: licenseInfo.homepage
                }).exec(function (err, license) {
                    if (!err) {
                        licenseIds.push(license.id);
                    }
                    cb(err);
                });
            });
        });
        series.push(function (cb) {
            Ossp.findOrCreate({
                name: projectInfo.name
            }, {
                name: projectInfo.name,
                description: projectInfo.summary,
                projectUrl: projectInfo.homepage,
                licenses: licenseIds
            }).exec(function (err, item) {
                resp.project = item;
                cb(err);
            });
        });
        async.series(series, function (err) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                console.log(resp);
                res.json(resp);
            }
        });
    });
};
//# sourceMappingURL=OsspController.js.map