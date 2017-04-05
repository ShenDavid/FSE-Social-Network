var express = require('express');
var msgdb = require('../models/message');
// var router = express.Router();

module.exports = {

    findPrivateMessages: function(req, res) {
      console.log("Controller THEM (authorname): " + req.query.authorname);
      console.log("Controller ME (target): " + req.query.target);
        msgdb.findPrivateMessages(req.query.authorname, req.query.target,
           function(err, docs) {
             if (err) {
                 res.status(500).send('Something broke!');
             } else {
                 //console.log('Controller docs' +  docs);
                 res.status(200).json(docs);
             }

         });

         // read messages from them to me
         msgdb.readMessages(req.query.authorname, req.query.target,
           console.log
         );

    },

    postPrivateMessages: function (req, res) {
        //return function(data) {
            //console.log("REST API: post private msg ------");
            msgdb.addMessage(req.body.content,
                req.body.author,
                'Private',
                req.body.target,
                function(err, msg) {
                    if (err) {
                        res.status(500).send('Something broke!');
                        //socket.broadcast.to(socket.id).emit('Error Saving Message');
                    } else {
                        console.log(msg);
                        res.status(200).json(msg);
                    }
                });
            //emit private socket
            //socket.broadcast.to(users[data.target]).emit('Private Message', data);
        //};
    },

    postPrivateMessage: function(socket, users) {
       return function(data) {
           socket.broadcast.to(users[data.target]).emit('Private Message', data);
       };
   },

   //read all messages for which you are the author and I am the target
   readReciept: function (socket) {
     return function(data) {
       msgdb.readMessages(data.author, data.target,
         function(id){}
      );
     };
   },

   unreadMessages: function (req, res) {
     msgdb.unreadMessages(req.query.target,
       function (err, authors) {
         if (err ) {res.status(404);}
         else {
           //authors is an array.  Make it json format.
           var jsonformat = function (author) { return {username:author};};
           console.log(authors.map(jsonformat));
           res.status(200).json(authors.map(jsonformat)); }
       });
   }
};
