/**
 * Created by sxh on 16/11/11.
 */

var express = require('express');
var group = require('../models/group');

module.exports = {
    findGroups: function(req, res) {
        group.findGroups(function(err, docs) {
            if (err) {
                console.log(err);
            } else {

                res.status(200).json(docs);

            }

        });
    },

    createGroup: function(socket) {
        return function(data) {
            group.addMessage(
                '',
                data.author,
                'groupmem',
                data.grouptag,
                data.identity,

                function(err, msg){
                    if (err) {
                        // TO DO : Error to client
                        console.log(err);

                        socket(socket.id).emit('Error Creating Group');
                    } else {
                        console.log(msg);
                    }
                });

            socket.broadcast.emit('Join Group', data)
        };
    },
    joinGroup: function(socket) {
        return function(data) {
            group.findOneUser(
                data.author,
                data.grouptag,
                function(err, msg){
                    if (msg == null) {
                        // TO DO : Error to client
                        console.log(err);

                        group.addMessage(
                            '',
                            data.author,
                            'groupmem',
                            data.grouptag,
                            data.identity,

                            function(err, message){
                                if (err) {
                                    // TO DO : Error to client
                                    console.log(err);

                                    socket(socket.id).emit('Error adding new user');
                                } else {
                                    console.log(message);
                                }
                            }
                        );
                    }
                    else if(msg.identity != data.identity){
                        console.log(msg);
                        group.updateIdentity(
                            data.author,
                            'groupmem',
                            data.grouptag,
                            data.identity,

                            function(err, message){
                                if (err) {
                                    // TO DO : Error to client
                                    console.log(err);

                                    socket(socket.id).emit('Error updating identity');
                                } else {
                                    console.log(message);
                                }
                            }
                        );
                    }
                }
            );

            socket.broadcast.emit('Join Group', data)
        };
    },
    findNeeders: function(req, res) {
        group.findNeeders(req.query.grouptag, function(err, docs) {
            if (err) {
                console.log(err);
            } else {
                res.status(200).json(docs);

            }

        });
    },
    findProviders: function(req, res) {
        group.findProviders(req.query.grouptag, function(err, docs) {
            if (err) {
                console.log(err);
            } else {
                res.status(200).json(docs);

            }

        });
    },
    findMessages: function(req, res) {
        group.findMessages(req.query.grouptag, function(err, docs) {

            {
                res.status(200).json(docs);

            }

        });
    },
    findnoidentities: function(req, res) {
        group.findnoidentities(req.query.grouptag, function(err, docs) {

            {
                res.status(200).json(docs);

            }

        });
    },
    postMessage: function(socket) {
        return function(data) {
            group.addMessage(data.content,
                data.author,
                'groupmes',
                data.grouptag,
                '',
                function(err, msg){
                    if (err) {
                        // TO DO : Error to client
                        console.log(err);

                        socket(socket.id).emit('Error Posting Message');
                    } else {
                        console.log(msg);
                    }
                });

            socket.broadcast.emit('Post Group', data)
        };
    }

};
