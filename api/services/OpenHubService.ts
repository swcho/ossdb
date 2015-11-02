/**
 * Created by sungwoo on 14. 9. 5.
 */

/// <reference path="../../typings/tsd.d.ts" />

import request = require('request');
import xml2js = require('xml2js');
import async = require('async');
import url = require('url');
var jsdom = require('jsdom');
var trim = require('trim');

module OpenHub {

    //https://www.openhub.net/p.xml?api_key=RbLeBswjUFhuHhAUM7QhQ&query=libusb
    var baseUrl = 'https://www.openhub.net';
    var KHostName = 'www.openhub.net';
    var apiKey = 'RbLeBswjUFhuHhAUM7QhQ';
    //var jqueryPath = '../../bower_components/jquery/dist/jquery.min.js';
    var jqueryPath = '../../bower_components/jquery/jquery.js';

    export interface TLicenseInfo {
        name: string;
        abbreviation: string;
        homepage: string;
        licenseText: string;
    }

    export interface TProjectInfo {
        name: string;
        homepage: string;
        summary: string;
        licenses: TLicenseInfo [];
    }

    export function queryProject(text, cb) {
        var url = baseUrl + '/p.xml?api_key=' + apiKey + '&query=' + text;
        request.get(url, function(error: any, response: any, body: any) {
            xml2js.parseString(body, function(err, result) {
                cb(result);
            });
        });
    }

    export function getProjectInfo(aUrl: string, cb: (err: any, projectInfo: TProjectInfo) => void) {
        request({
            url: aUrl
        }, function(error: any, response: any, body: any) {

            var projectInfo: TProjectInfo = {
                name: '',
                homepage: '',
                summary: '',
                licenses: []
            };

            jsdom.env({
                html: body,
                scripts: ['http://code.jquery.com/jquery-1.6.min.js'],
                done: function(err, window){
                    //Use jQuery just as in a regular HTML page
                    var $ = window.jQuery;
                    projectInfo.name = trim($("#project_header h1").text());
                    projectInfo.homepage = $('a:contains("Homepage")').attr("href");
                    projectInfo.summary = trim($('#project_summary').text());

                    var series = [];
                    $('[itemProp=publishingPrinciples]').children('a').each(function() {
                        var licenseUrl = $(this).attr("href");
                        var parsedUrl = url.parse(licenseUrl);
                        if (parsedUrl.hostname == KHostName) {
                            series.push(function(cb) {
                                getLicenseInfo(licenseUrl, cb);
                            });
                        }
                    });
                    if (series.length) {
                        async.series(series, function(err, licenseInfoList) {
                            projectInfo.licenses = licenseInfoList;
                            cb(err, projectInfo);
                        });
                    } else {
                        cb(err, projectInfo);
                    }
                }
            });
        });
    }

    export function getLicenseInfo(url, cb: (err: any, licenseInfo: TLicenseInfo) => void) {
        request({
            url: url
        }, function(error: any, response: any, body: any) {

            var licenseInfo: TLicenseInfo = {
                name: '',
                abbreviation: '',
                homepage: '',
                licenseText: ''
            };

            jsdom.env({
                html: body,
                scripts: [jqueryPath],
//                scripts: ['http://code.jquery.com/jquery-1.6.min.js'],
                done: function(err, window){
                    //Use jQuery just as in a regular HTML page
                    var $ = window.jQuery;
                    var title = $('#license').find('h1 a[title]').attr('title');
                    var match = /(.*)\((.+)\)/.exec(title);
                    if (match) {
                        licenseInfo.name = trim(match[1]);
                        licenseInfo.abbreviation = trim(match[2]);
                    } else {
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

    function get_info_from_ohloh(aFileName: string, aSearchId: string, aCb: (ohlohInfo) => void) {
        var retrieve = true;
        if (fs.existsSync(aFileName)) {
            var stat = fs.statSync(aFileName);
            if (now.getTime() -  stat.mtime.getTime() < time1day) {
                retrieve = false;
            }
        }

        if (retrieve) {
            https.get('https://www.ohloh.net/p.xml?api_key=' + ohloh_key + '&query=' + aSearchId, (res) => {
                var allData = '';
                res.on('data', (data) => {
                    allData += data.toString();
                });
                res.on('end', () => {
//                    common.debug(allData);
                    xml2js.parseString(allData, (err, searchResult) => {
                        fs.writeFileSync(aFileName + '.xml', allData);
                        if (searchResult && searchResult.response.items_returned[0] != '0') {
                            fs.writeFileSync(aFileName, JSON.stringify(searchResult, null, 4));
                            aCb(searchResult);
                        } else {
                            fs.writeFileSync(aFileName, "");
                            aCb(null);
                        }
                    });
                });
            });
        } else {
            var fileContents = fs.readFileSync(aFileName).toString();
            if (fileContents && fileContents.length) {
                aCb(JSON.parse(fileContents));
            } else {
                aCb(null);
            }
        }
    }
}

export = OpenHub;
