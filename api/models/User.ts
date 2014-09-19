/**
 * Created by sungwoo on 14. 9. 16.
 */

/// <reference path="../../typings/tsd.d.ts" />

var bcrypt = require('bcrypt');

export var attributes = {
    name: {
        type: 'string',
        required: true
    },
    title: {
        type: 'string'
    },
    email: {
        type: 'string',
        email: true,
        required: true,
        unique: true
    },
    encryptedPassword: {
        type: 'string'
    },
    userPassword: {
        type: 'string'
    },
    toJSON: function() {
        var obj = this.toObject();
        delete obj.encryptedPassword;
        return obj;
    }
};

export function beforeCreate(user, cb) {
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            console.log(err);
            cb(err);
            return;
        }

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
                console.log(err);
                cb(err);
                return;
            }

            user.encryptedPassword = hash;
            cb(null, user);
        });
    });
}
