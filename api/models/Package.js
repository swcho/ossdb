/**
 * Package.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        name: {
            type: 'string',
            unique: true
        },
        ossp: {
            model: 'ossp'
        },
        license: {
            model: 'license'
        },
        file: {
            type: 'string'
        },
        md5: {
            type: 'string'
        },
        projects: {
            collection: 'project',
            via: 'packages',
            dominant: true
        }
    }
};

