var express = require('express');
var mapdb = require('../models/map');

module.exports = {
  getMarkerInfo: function (req, res) {
    mapdb.getMarkerInfo(
      function (err, docs) {
        if (err ) {res.status(404);}
        else {
          res.status(200).json(docs); //docs is an array
        }
      });
  },
  setMarkerInfo: function(req, res) {
      mapdb.addMarkerInfo(req.body.lat,
          req.body.lng,
          req.body.title,
          req.body.message,
          function(err, msg) {
              if (err) {
                  // TO DO : Error to client
                  console.log(err);
                  res.status(500).send('Something broke!');
              } else {
                  console.log(msg);
                  res.status(200).json(msg);
              }
          });

  },
  removeMarkerInfo: function(req, res) {
      mapdb.removeMarkerInfo(req.body.id,
          function(err, msg) {
              if (err) {
                  // TO DO : Error to client
                  console.log(err);
                  res.status(404);
              } else {
                  res.status(200).send(msg);  //removed counts
              }
          });

  }
};
