/**
 * Created by sungwoo on 14. 9. 15.
 */
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../defs/ossdb.ts" />
var OpenHubService = require('../services/OpenHubService');
module.exports = require("../services/PaginationController")();
module.exports.getAll = function (req, res) {
    License.find({}).exec(function (err, items) {
        res.send(items);
    });
};
module.exports.importOpenHub = function (req, res) {
    var url = req.param('url');
    var resp = {
        url: url,
        licenseInfo: null,
        license: null
    };
    OpenHubService.getLicenseInfo(url, function (err, licenseInfo) {
        if (err) {
            res.send(err);
            return;
        }
        resp.licenseInfo = licenseInfo;
        License.findOrCreate({
            name: licenseInfo.name
        }, {
            name: licenseInfo.name,
            shortName: licenseInfo.abbreviation,
            description: licenseInfo.licenseText,
            url: licenseInfo.homepage
        }).exec(function (err, license) {
            if (err) {
                res.send(err);
                return;
            }
            resp.license = license;
            res.json(resp);
        });
    });
};
//# sourceMappingURL=LicenseController.js.map