var express = require('express');
var msgdb = require('../models/message');
// var router = express.Router();

module.exports = {
    findPublicMessages: function(req, res) {
        msgdb.findPublicMessages(function(err, docs) {
            if (err) {
                console.log(err);
            } else {
                res.status(200).json(docs);
            }

        });
    },

    postPublicMessages: function(req, res) {
        //return function(data) {
            //console.log("REST API: post public---------");
            msgdb.addMessage(req.body.content,
                req.body.author,
                'WALL',
                'ALL',  //target
                function(err, msg) {
                    if (err) {
                        console.log(err);
                        res.status(500).send('Something broke!');
                    } else {
                        console.log(msg);
                        res.status(200).json(msg);
                    }
                });
    },

    postPublicMessage: function(socket) {
        return function(data) {
            // msgdb.addMessage(data.content,
            //     data.author,
            //     'WALL',
            //     'ALL',  //target
            //     function(err, msg) {
            //         if (err) {
            //             // TO DO : Error to client
            //             console.log(err);
            //
            //             socket(socket.id).emit('Error Saving Message');
            //         } else {
            //             console.log(msg);
            //         }
            //     });

            socket.broadcast.emit('Public Message', data);
        };
    }
};
