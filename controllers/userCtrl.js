var express = require('express');
var User = require('../models/user');
var crypto = require('crypto');
var CryptoJS = require('crypto-js');


var decryptPassword = function(password) {
        // Decrypt
        var bytes = CryptoJS.AES.decrypt(password, 'secret key 666');
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        console.log(decryptedData);
        return decryptedData;
    };

// hash password with sha512 and salt
var sha512 = function(password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};
// salt and hash password
function saltHashPassword(userpassword) {
    var salt = crypto.randomBytes(8)
        .toString('hex')
        .slice(0, 16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    return passwordData;
}


module.exports = {
    editStatus: function(socket) {
        return function(data) {
            User.editStatusCode(data.status,data.name,console.log);
            socket.broadcast.emit('Change Status', data);
        };
    },


    findUsers: function(req, res) {
        User.findUsers(function(err, users) {
            if (err) {
                res.status(404);
            } else {
                res.status(200).json(users);
            }

        });
    },

    login: function(req, res) {
        var username = req.body.username;
        var password = decryptPassword(req.body.password);
        console.log('login username: ' + username);
        console.log('login password: ' + password.toString());
        User.findUserByName(username, function(err, user) {
            if (err) {
                res.status(200).json({
                    'message': 'auth-not-username'
                });
            } else {
                if (!user) {
                    res.status(200).json({
                        'message': 'auth-not-username'
                    });
                }
                else if (!user.active) {
                  res.status(200).json({
                      'message': 'auth-not-authorized'
                  });
                }
                else {
                    var passwordData = sha512(password, user.salt);
                    if (user.password === passwordData.passwordHash) {
                        res.status(200).json({
                            'message': 'auth-login-success',
                            "user": user
                        });
                    } else {
                        res.status(200).json({
                            'message': 'auth-not-authenticated'
                        });
                    }
                }

            }
        });
    },

    setPassword: function(req, res) {
        var username = req.body.target;
        var password = req.body.password;

        var passwordData = saltHashPassword(password);

        User.setPassword(username, passwordData.passwordHash, passwordData.salt,
            function(err, user) {
                if (err) {
                    res.status(400);
                } else {
                    res.status(201).json();
                }
            });
    },

    signup: function(req, res) {
        var username = req.body.username;
        var password = decryptPassword(req.body.password);

        var passwordData = saltHashPassword(password);
        User.addUser(username, passwordData.passwordHash, passwordData.salt,
            function(err, user) {
                if (err) {
                    res.status(400);
                } else {
                    res.status(201).json({
                        "user": user
                    });
                }
            });
    },



    //When a user logs in to the community
    // Will emit "Online"
    userEnters: function(io, socket, users) {
        return function(data) {
            // bind username to db
            socket.username = data.username;

            users[data.username] = socket.id;   //add socket.id to list
            if (data.username) {
                // Update user in db
                User.editLoginTime(socket.username, console.log);
                User.editAccountStatus(socket.username,
                    "Online",
                    function(err, user) {
                        if (err) {
                            console.log(err);
                        } else {
                            socket.broadcast.emit('Online', user);
                        }
                    }
                );
                // broadcast user status
                // just in case log.  turn this off later
            }
        };
    },


    //When a user logs out of the community
    userExits: function(socket) {
        return function(data) {
            // Update user in db
            if (socket.username) {
                User.editAccountStatus(socket.username,
                    "Offline",
                    function(err, user) {
                        if (err) {
                            console.log(err);
                        } else {
                            socket.broadcast.emit('Offline', user);
                        }

                    });
            }
        };
    }

};
