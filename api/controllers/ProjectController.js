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
        }).exec(function (err, p) {
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

        Project.update({
            projectId: project.projectId
        }, {
            packages: packages
        }).exec(function (err, p) {
            console.log(err);
            console.log(p);

            project = p;
            cb();
        });
    });

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
