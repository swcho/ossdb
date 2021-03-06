/**
* Ossp.js
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
      description: {
          type: 'string'
      },
      projectUrl: {
          type: 'string'
      },
      packages: {
          collection: 'package',
          via: 'ossp'
      },
      licenses: {
          collection: 'license',
          via: 'ossps'
      }
  }
};

