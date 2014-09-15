/**
* Created by sungwoo on 14. 9. 1.
*/
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../defs/ossdb.ts" />
var async = require('async');
module.exports = require("../services/PaginationController")();

module.exports.detail = function (req, res) {
    var id = req.param('id');
    var project;
    var series = [];
    var packagesToGetLicense = [];
    series.push(function (cb) {
        Project.findOne({
            id: id
        }).populate('packages').exec(function (err, p) {
            if (p) {
                project = p;
                project.packages.forEach(function (pkg) {
                    if (pkg.license) {
                        packagesToGetLicense.push(pkg);
                    }
                });
            }
            cb(err);
        });
    });

    series.push(function (cb) {
        var licenseIds = [];
        packagesToGetLicense.forEach(function (pkg) {
            licenseIds.push(pkg.license);
        });

        console.log('get license info');
        console.log(licenseIds);

        License.find().where({
            id: licenseIds
        }).exec(function (err, licenseList) {
            licenseList.forEach(function (l, index) {
                console.log(packagesToGetLicense[index]);
                console.log(l);

                packagesToGetLicense[index].license = l;
            });
            cb();
        });
    });

    async.series(series, function (err) {
        res.json(project);
    });
};

module.exports.setProjectWithPackages = function (req, res) {
    var param = req.body;

    console.log(JSON.stringify(param));

    var project;
    var resp = {
        ok: false,
        projectAdded: false,
        projectUpdated: false,
        packageNamesCreated: [],
        packageNamesAdded: [],
        packageNamesRemoved: []
    };

    var series = [];

    // get previous project item
    series.push(function (cb) {
        console.log('get project or create');

        Project.findOrCreate({
            projectId: param.projectId
        }, {
            projectId: param.projectId
        }).populate('packages').exec(function (err, p) {
            console.log(p);
            project = p;
            cb();
        });
    });

    // get package id list
    var packages = [];
    param.packageInfoList.forEach(function (info) {
        series.push(function (cb) {
            console.log('get package list');
            console.log(info);

            Package.findOrCreate({
                name: info.name
            }, {
                name: info.name,
                type: info.type
            }).exec(function (err, p) {
                console.log(p);

                packages.push(p.id);
                cb();
            });
        });
    });

    // set project with packages
    series.push(function (cb) {
        console.log("Update packages");

        packages.forEach(function (pkgId) {
            project.packages.add(pkgId);
        });
        project.save(function (err) {
            console.log(err);

            cb();
        });
        //        Project.update({
        //            projectId: project.projectId
        //        }, {
        //            packages: packages
        //        }).exec(function(err, p: TProject) {
        //
        //            console.log(err);
        //            console.log(p);
        //
        //            project = p;
        //            cb();
        //        });
    });

    // finalize
    series.push(function (cb) {
        resp.ok = true;
        res.json(resp);
        cb();
    });

    async.series(series);
};
//# sourceMappingURL=ProjectController.js.map
