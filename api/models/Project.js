/**
 * Project.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
exports.attributes = {
    projectId: {
        type: 'string',
        unique: true
    },
    tm: {
        type: 'string'
    },
    pm: {
        type: 'string'
    },
    pdm_url: {
        type: 'string'
    },
    family: {
        type: 'string'
    },
    packages: {
        collection: 'Package',
        via: 'projects'
    },
    projectSubmit: {
        model: 'ProjectSubmit'
    }
};
//# sourceMappingURL=Project.js.map