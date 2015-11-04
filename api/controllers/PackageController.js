/**
 * PackageController
 *
 * @description :: Server-side logic for managing packages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../defs/ossdb.ts" />
var openhub = require('../services/OpenHubService');
var fs = require('fs');
var async = require('async');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var mime = require('mime');
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
module.exports.search = function (req, res) {
    var name = req.param('name');
    Package.find({
        name: {
            contains: name
        }
    }).sort('name').exec(function (err, resp) {
        res.json(resp);
    });
};
var KDataBase = 'data';
module.exports.upload = function (req, res) {
    var id = req.param('id');
    var name = req.param('name');
    if (!id || !name) {
        res.send(500);
        return;
    }
    var target_dir = KDataBase + '/' + name;
    var uploadedFile;
    async.series([
        function (done) {
            req.file('file_data').upload(function (err, uploadedFiles) {
                console.log(uploadedFiles);
                if (uploadedFiles.length != 1) {
                    done('single file allowed');
                }
                else {
                    uploadedFile = uploadedFiles[0];
                    done(err);
                }
            });
        },
        function (done) {
            rimraf(target_dir, done);
        },
        function (done) {
            mkdirp(target_dir, done);
        },
        function (done) {
            fs.rename(uploadedFile.fd, target_dir + '/' + uploadedFile.filename, done);
        },
        function (done) {
            Package.update({
                id: id
            }, {
                file: uploadedFile.filename
            }).exec(done);
        }
    ], function (err) {
        if (err) {
            console.log(err);
            res.send(500);
        }
        else {
            res.send(200, uploadedFile);
        }
    });
};
module.exports.download = function (req, res) {
    var id = req.param('id');
    var name = req.param('name');
    var file = req.param('file');
    var path = KDataBase + '/' + name + '/' + file;
    console.log('download: ' + path);
    //var SkipperDisk = require('skipper-disk');
    //var fileAdapter = SkipperDisk(/* optional opts */);
    //fileAdapter.read(path).on('error', function (err) {
    //    return res.serverError(err);
    //}).pipe(res);
    var mimetype = mime.lookup(path);
    res.setHeader('Content-disposition', 'attachment; filename=' + file);
    res.setHeader('Content-type', mimetype);
    var filestream = fs.createReadStream(path);
    filestream.pipe(res);
};
//# sourceMappingURL=PackageController.js.map