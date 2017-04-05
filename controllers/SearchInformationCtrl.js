var express = require('express');
var userdb = require('../models/user');
var announcedb = require('../models/announce');
var messagedb = require('../models/message');

module.exports = {
    findUsersByStatus: function(req, res) {
        var status = req.body.status;
        userdb.findUsersByStatus(status, function(err, users) {
            if (err) {
            } else {
                res.status(200).json({
                    "users": users
                });
            }
        });
    },

    findUsersByName: function(req, res) {
        var name = req.body.username;
        userdb.findUsersByRegexName(name, function(err, users) {
            if (err) {
            } else {
                res.status(200).json({
                    "users": users
                });
            }
        });
    },

    findAnnouncements: function(req, res) {
        var words = req.body.words;
        announcedb.findAnnouncementsByWords(words, function(err, announcements) {
            if (err) {
            } else {
                res.status(200).json({
                    "announcements": announcements
                });
            }
        });
    },

    findPublicMessages: function(req, res) {
        var words = req.body.words;
        messagedb.findPublicMessagesByWords(words, function(err, publicMessages) {
            if (err) {
            } else {
                res.status(200).json({
                    "publicMessages": publicMessages
                });
            }
        });
    },

    findPrivateMessages: function(req, res) {
        var username = req.body.username;
        var words = req.body.words;

        messagedb.findPrivateMessagesByWords(username, words, function(err, privateMessages) {
            if (err) {
            } else {
                res.status(200).json({
                    "privateMessages": privateMessages
                });
            }
        });
    }

};
