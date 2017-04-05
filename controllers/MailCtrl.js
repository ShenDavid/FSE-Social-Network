var express = require('express');
var maildb = require('../models/mail');

module.exports = {

    findInMails: function(req, res) {
        maildb.findInMails(req.body.to,
            function(err, mails) {
                if (err) {
                } else {
                    console.log(mails);
                    res.status(200).json({
                        "mails": mails
                    });
                }
            });
    },

    findSentMails: function(req, res) {
        maildb.findSentMails(req.body.from,
            function(err, mails) {
                if (err) {
                  console.log(err);
                } else {
                    // console.log(mails);
                    res.status(200).json({
                        "mails": mails
                    });
                }
            });
    },

    addMail: function(req, res) {
        maildb.addMail(req.body.from, req.body.to, req.body.subject, req.body.body,
            function(err, mail) {
                if (err) {
                } else {
                    console.log(mail);
                    res.status(200).json({
                        "mail": mail
                    });
                }
            });
    },

    deleteMail: function(req, res) {
        maildb.deleteMail(req.body.from, req.body.to, req.body.subject, req.body.body,
            function(err, mail) {
                if (err) {
                } else {
                    console.log(mail);
                    res.status(200).json("deleted");
                }
            });
    },
    notifyMail: function(socket, users) {
        return function(data) {
            socket.broadcast.to(users[data.to]).emit('New Mail', data);
        };
    }
};
