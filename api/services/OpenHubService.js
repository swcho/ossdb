/**
 * Created by sungwoo on 14. 9. 5.
 */
/// <reference path="../../typings/tsd.d.ts" />
var request = require('request');
var xml2js = require('xml2js');
var async = require('async');
var url = require('url');
var jsdom = require('jsdom');
var trim = require('trim');
var OpenHub;
(function (OpenHub) {
    //https://www.openhub.net/p.xml?api_key=RbLeBswjUFhuHhAUM7QhQ&query=libusb
    var baseUrl = 'https://www.openhub.net';
    var KHostName = 'www.openhub.net';
    var apiKey = 'RbLeBswjUFhuHhAUM7QhQ';
    //var jqueryPath = '../../bower_components/jquery/dist/jquery.min.js';
    var jqueryPath = '../../bower_components/jquery/jquery.js';
    function queryProject(text, cb) {
        var url = baseUrl + '/p.xml?api_key=' + apiKey + '&query=' + text;
        request.get(url, function (error, response, body) {
            xml2js.parseString(body, function (err, result) {
                cb(result);
            });
        });
    }
    OpenHub.queryProject = queryProject;
    function getProjectInfo(aUrl, cb) {
        request({
            url: aUrl
        }, function (error, response, body) {
            var projectInfo = {
                name: '',
                homepage: '',
                summary: '',
                licenses: []
            };
            jsdom.env({
                html: body,
                scripts: ['http://code.jquery.com/jquery-1.6.min.js'],
                done: function (err, window) {
                    //Use jQuery just as in a regular HTML page
                    var $ = window.jQuery;
                    projectInfo.name = trim($("#project_header h1").text());
                    projectInfo.homepage = $('a:contains("Homepage")').attr("href");
                    projectInfo.summary = trim($('#project_summary').text());
                    var series = [];
                    $('[itemProp=publishingPrinciples]').children('a').each(function () {
                        var licenseUrl = $(this).attr("href");
                        var parsedUrl = url.parse(licenseUrl);
                        if (parsedUrl.hostname == KHostName) {
                            series.push(function (cb) {
                                getLicenseInfo(licenseUrl, cb);
                            });
                        }
                    });
                    if (series.length) {
                        async.series(series, function (err, licenseInfoList) {
                            projectInfo.licenses = licenseInfoList;
                            cb(err, projectInfo);
                        });
                    }
                    else {
                        cb(err, projectInfo);
                    }
                }
            });
        });
    }
    OpenHub.getProjectInfo = getProjectInfo;
    function getLicenseInfo(url, cb) {
        request({
            url: url
        }, function (error, response, body) {
            var licenseInfo = {
                name: '',
                abbreviation: '',
                homepage: '',
                licenseText: ''
            };
            jsdom.env({
                html: body,
                scripts: [jqueryPath],
                //                scripts: ['http://code.jquery.com/jquery-1.6.min.js'],
                done: function (err, window) {
                    //Use jQuery just as in a regular HTML page
                    var $ = window.jQuery;
                    var title = $('#license').find('h1 a[title]').attr('title');
                    var match = /(.*)\((.+)\)/.exec(title);
                    if (match) {
                        licenseInfo.name = trim(match[1]);
                        licenseInfo.abbreviation = trim(match[2]);
                    }
                    else {
                        licenseInfo.name = trim(title);
                    }
                    var $licenseUrlLabel = $('p:contains("Read more about this license")');
                    licenseInfo.homepage = $licenseUrlLabel.children('a').attr('href');
                    var licenseText = $licenseUrlLabel.prev().text();
                    licenseInfo.licenseText = licenseText.indexOf('Provide') == 0 ? '' : licenseText;
                    cb(err, licenseInfo);
                }
            });
        });
    }
    OpenHub.getLicenseInfo = getLicenseInfo;
})(OpenHub || (OpenHub = {}));
module.exports = OpenHub;
//# sourceMappingURL=OpenHubService.js.map