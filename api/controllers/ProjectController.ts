/**
 * Created by sungwoo on 14. 9. 1.
 */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../defs/ossdb.ts" />

import async = require('async');

module.exports = require("../services/PaginationController")();

export interface TPackageInfo {
    name: string;
    type: string;
}

export interface TSetProjectWithPackagesParam {
    projectId: string;
    packageInfoList: TPackageInfo[];
}

export interface TSetProjectWithPackagesResp {
    ok: boolean;
    projectAdded: boolean;
    projectUpdated: boolean;
    packageNamesCreated: string[];
    packageNamesAdded: string[];
    packageNamesRemoved: string[];
}

function test(req, res) {
    console.log('test');
    res.json({
        message: 'hi'
    });
}

module.exports.test = test;

function setProjectWithPackages(req, res) {
    var param: TSetProjectWithPackagesParam = req.body;

    console.log(JSON.stringify(param));

    var project; //: TProject;
    var resp: TSetProjectWithPackagesResp = {
        ok: false,
        projectAdded: false,
        projectUpdated: false,
        packageNamesCreated: [],
        packageNamesAdded: [],
        packageNamesRemoved: []
    };

    var series = [];

    // get previous project item
    series.push((cb) => {

        console.log('get project or create');

        Project.findOrCreate({
            projectId: param.projectId
        }, {
            projectId: param.projectId
        }).populate('packages').exec(function(err, p: TProject) {
            console.log(p);
            project = p;
            cb();
        });
    });

    // get package id list
    var packages: number[] = [];
    param.packageInfoList.forEach(function (info) {
        series.push(function (cb) {

            console.log('get package list');
            console.log(info);

            Package.findOrCreate({
                name: info.name
            }, {
                name: info.name,
                type: info.type
            }).exec(function(err, p: TPackage) {

                console.log(p);

                packages.push(p.id);
                cb();
            });
        });
    });


    // set project with packages
    series.push(function(cb) {

        console.log("Update packages");

        packages.forEach(function(pkgId) {
            project.packages.add(pkgId);
        });
        project.save(function(err) {

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
    series.push((cb) => {
        resp.ok = true;
        res.json(resp);
        cb();
    });

    async.series(series);

};

module.exports.setProjectWithPackages = setProjectWithPackages;