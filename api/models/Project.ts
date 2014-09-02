/**
 * Project.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

export var attributes = {
    projectId: {
        type: 'string',
        unique: true
    },
    packages: {
        collection: 'Package'
    }
};
