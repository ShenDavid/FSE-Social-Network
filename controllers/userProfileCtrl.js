var express = require('express');
var User = require('../models/user');

module.exports = {
  getProfile : function(req, res) {
    User.findUserByName( req.params.username, function (err, user ) {

    User.findUserProfileByName(req.params.username, function(err, profile) {
      if (err) console.log(err);
      else {
        res.status(200).json(user);
      }
    })
  });
  },

  uploadProfile: function(req, res) {
    User.editProfile(req.body.username, req.body.profile, req.body.filename, function(err, user) {
      if (err) {
        console.log(err);
      }
      else {
        res.status(200).json({user:user});
      }
    })
  },

  ActivateUser: function(socket) {
    return function(data){
      console.log("Activate User", data)
      User.editActive(data, true, function(id){id});

    }
  },

  DeactivateUser: function(socket){
    return function(data) {
      console.log("Deactivate User", data);
      User.editActive(data, false, function(err,docs){
      });
      socket.broadcast.emit('Deactivate User', data);

    }
  },

  setUsername: function (req,res) {
    console.log("SET USERNAME", req.body)
    User.editUsername(req.body.target, req.body.newname, function(err,doc){
          res.status(200).json();
    });
  },

  setPrivilage: function (req,res) {
    console.log("SET PRIVILAGE");
    User.editPrivilage(req.body.target, req.body.privilage, function(err,doc){
          res.status(200).json();
    });

  }

}
