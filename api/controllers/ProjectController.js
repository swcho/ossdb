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
    //    console.log('setProjectWithPackages');
    //    console.log(req.user);
    //    console.log(JSON.stringify(param));
    // validate project id exists
    if (!param.projectId) {
        res.send(400, {
            message: "projectId doesn't exist"
        });
        return;
    }
    param.packageInfoList = param.packageInfoList || [];
    var project; //: TProject;
    var resp = {
        ok: false,
        projectAdded: false,
        projectUpdated: false,
        packageNamesCreated: [],
        packageNamesAdded: [],
        packageNamesRemoved: []
    };
    var series = [];
    series.push(function (cb) {
        //        console.log('check project exists');
        Project.findOne({
            projectId: param.projectId
        }).exec(function (err, p) {
            if (p) {
                resp.projectUpdated = true;
            }
            else {
                resp.projectAdded = true;
            }
            cb(err);
        });
    });
    // get previous project item
    series.push(function (cb) {
        //        console.log('get project or create');
        Project.findOrCreate({
            projectId: param.projectId
        }, {
            projectId: param.projectId
        }).populate('packages').exec(function (err, p) {
            var newPackageNames = [], prevPackageNames = [];
            param.packageInfoList.forEach(function (newInfo) {
                newPackageNames.push(newInfo.name);
            });
            if (p.packages) {
                p.packages.forEach(function (prevInfo) {
                    prevPackageNames.push(prevInfo.name);
                });
            }
            newPackageNames.forEach(function (pkgName) {
                if (prevPackageNames.indexOf(pkgName) === -1) {
                    resp.packageNamesAdded.push(pkgName);
                }
            });
            prevPackageNames.forEach(function (pkgName) {
                if (newPackageNames.indexOf(pkgName) === -1) {
                    resp.packageNamesRemoved.push(pkgName);
                }
            });
            project = p;
            cb(err);
        });
    });
    // get package id list
    var packages = [];
    param.packageInfoList.forEach(function (info) {
        series.push(function (cb) {
            Package.findOne({
                name: info.name
            }).exec(function (err, p) {
                if (!p) {
                    resp.packageNamesCreated.push(info.name);
                }
                cb(err);
            });
        });
        series.push(function (cb) {
            //                console.log('get package list');
            //                console.log(info);
            Package.findOrCreate({
                name: info.name
            }, {
                name: info.name,
                type: info.type
            }).exec(function (err, p) {
                packages.push(p.id);
                cb(err);
            });
        });
    });
    // set project with packages
    series.push(function (cb) {
        //        console.log("Update packages");
        project.packages = [];
        packages.forEach(function (pkgId) {
            project.packages.add(pkgId);
        });
        project.save(function (err) {
            if (err) {
                console.log(err);
            }
            cb(err);
        });
    });
    series.push(function (cb) {
        //        console.log('add submit history');
        ProjectSubmit.create({
            user: req.user.id,
            project: project.id,
            packages: JSON.stringify(param.packageInfoList)
        }).exec(function (err, resp) {
            if (err) {
                console.log(err);
            }
            if (resp) {
            }
            cb(err);
        });
    });
    async.series(series, function (err) {
        if (err) {
            res.send(500, {
                message: err,
                info: resp
            });
        }
        else {
            resp.ok = true;
            res.json(resp);
        }
    });
};
//# sourceMappingURL=ProjectController.js.map