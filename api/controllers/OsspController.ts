/**
 * Created by sungwoo on 14. 9. 15.
 */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../defs/ossdb.ts" />

import OpenHubService = require('../services/OpenHubService');
module.exports = require("../services/PaginationController")();

module.exports.importOpenHub = function(req, res) {
    var url = req.param('url');

    var resp = {
        url: url,
        projectInfo: null
    };

    OpenHubService.getProjectInfo(url, function(err, projectInfo: OpenHubService.TProjectInfo) {
        resp.projectInfo = projectInfo;

        Ossp.findOrCreate({
            name: projectInfo.name
        }, {
            name: projectInfo.name,
            description: projectInfo.summary,
            projectUrl: projectInfo.homepage
        }).exec(function(err, item) {
            console.log(item);
            res.json(resp);
        });

    });
};
