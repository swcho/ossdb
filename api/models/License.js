/**
* License.js
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
      longName: {
          type: 'string'
      },
      description: {
          type: 'string'
      },
      url: {
          type: 'string'
      },
      distributeLicense: {
          type: 'boolean'
      },
      distributeSource: {
          type: 'boolean'
      },
      packages: {
          collection: 'package',
          via: 'license'
      }
  }
};

