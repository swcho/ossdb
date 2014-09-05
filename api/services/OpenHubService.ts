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
}

export = OpenHub;
