/**
* Created by sungwoo on 14. 9. 1.
*/
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../defs/ossdb.ts" />
var async = require('async');

module.exports = require("../services/PaginationController")();

function test(req, res) {
    console.log('test');
    res.json({
        message: 'hi'
    });
}

module.exports.test = test;

function setProjectWithPackages(req, res) {
    // aParam: TSetProjectWithPackagesParam, aCb: (aResp: TSetProjectWithPackagesResp) => void
    var aParam = req.body;

    console.log(JSON.stringify(aParam));
    var packagesByName = {};
    var project;
    var newProject;
    var resp = {
        ok: false,
        projectAdded: false,
        projectUpdated: false,
        packageNamesCreated: [],
        packageNamesAdded: [],
        packageNamesRemoved: []
    };

    var series = [];

    // get packages
    series.push(function (cb) {
        console.log('get packages');
        Package.find().exec(function (err, packageList) {
            if (packageList) {
                console.log(packageList);
                packageList.forEach(function (p) {
                    packagesByName[p.name] = p;
                });
            }
            cb();
        });
    });

    // get previous project item
    series.push(function (cb) {
        console.log('get previous project item');

        Project.findOne({
            projectId: aParam.projectId
        }).exec(function (err, p) {
            console.log(p);
            project = p;
            cb();
        });
    });

    // add new project if previous project item does not exist
    series.push(function (cb) {
        if (!project) {
            console.log('set new project if previous project item does not exist');
            Project.create({
                projectId: aParam.projectId
            }).exec(function (err, p) {
                newProject = p;
                console.log(p);
                resp.projectAdded = true;
                cb();
            });
        } else {
            cb();
        }
    });

    var newPackages = [];

    // set packages
    series.push(function (cb) {
        var newPackageNames = [];
        var packageNames = Object.keys(packagesByName);
        aParam.packageInfoList.forEach(function (info) {
            if (packageNames.indexOf(info.name) == -1 && newPackageNames.indexOf(info.name) == -1) {
                newPackages.push({
                    name: info.name,
                    type: info.type
                });
                newPackageNames.push(info.name);
            }
        });
        console.log('new packages to add: ' + newPackageNames.join(','));
        if (newPackageNames.length) {
            Package.create(newPackages).exec(function (err) {
                console.log('set packages');
                resp.packageNamesCreated = newPackageNames;

                // update package list
                Package.find().exec(function (err, packageList) {
                    if (packageList) {
                        console.log('update package list with count ' + packageList.length);
                        packageList.forEach(function (p) {
                            packagesByName[p.name] = p;
                        });
                    }
                    cb();
                });
            });
        }
    });

    //    // add packages to project
    //    series.push((cb) => {
    //        if (project) {
    //            if (project.packages) {
    //                console.log('has packages');
    //                console.log(project.packages);
    //
    //                var packageNames = [];
    //                project.packages.forEach((p) => {
    //                    packageNames.push(p.name);
    //                });
    //
    //                var usagesToBeAdded = [];
    //                var requestedPackageNames = [];
    //                aParam.packageInfoList.forEach((info) => {
    //                    usagesToBeAdded.push({
    //                        projectId: project.id,
    //                        packageId: packagesByName[info.name].id
    //                    });
    //                    if (packageNames.indexOf(info.name) == -1) {
    ////                        usagesToBeAdded.push({
    ////                            projectId: newProject.id,
    ////                            packageId: packagesByName[name].id
    ////                        });
    //                        resp.packageNamesAdded.push(info.name);
    //                    }
    //                    requestedPackageNames.push(info.name);
    //                });
    //
    ////                var usagesToBeRemoved = [];
    //                project.packages.forEach((p) => {
    //                    if (requestedPackageNames.indexOf(p.name) == -1) {
    ////                        usagesToBeRemoved.push(p.id);
    //                        resp.packageNamesRemoved.push(p.name);
    //                    }
    //                });
    //
    //                PackageUsage.all({
    //                    where: {
    //                        projectId: project.id
    //                    }
    //                },(err, usages) => {
    //                    console.log(err);
    //                    console.log(usages);
    //                    console.log(typeof usages);
    //
    //                    var series = [];
    //                    usages.forEach((u) => {
    //                        series.push((cb) => {
    //                            u.destroy(cb);
    //                        });
    //                    });
    //                    series.push((cb) => {
    //                        PackageUsage.create(usagesToBeAdded, (err, usages) => {
    //                            console.log('Usages');
    //                            console.log(usages);
    //                            cb();
    //                        });
    //                    });
    //                    series.push((cb2) => {
    //                        cb2();
    //                        cb();
    //                    });
    //                    async.series(series);
    //                });
    //                resp.projectUpdated = true;
    //            } else {
    //                cb();
    //            }
    //        } else {
    //            console.log('update packages to project');
    //            console.log(JSON.stringify(packagesByName, null, 2));
    //            var usages = [];
    //            newPackages.forEach((info) => {
    //                console.log(info.name);
    //                usages.push({
    //                    projectId: newProject.id,
    //                    packageId: packagesByName[info.name].id
    //                });
    //                resp.packageNamesAdded.push(info.name);
    //            });
    //            PackageUsage.create(usages, (err, usages) => {
    //                console.log('Usages');
    //                console.log(usages);
    //                cb();
    //            });
    //        }
    //    });
    // finalize
    series.push(function (cb) {
        resp.ok = true;
        res.json(resp);
        cb();
    });

    async.series(series);
}
;

module.exports.setProjectWithPackages = setProjectWithPackages;
//# sourceMappingURL=ProjectController.js.map
