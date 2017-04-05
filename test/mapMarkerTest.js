var mongoose = require('mongoose');
var config = require('../config');
var mapdb = require('../models/map');
var assert = require('assert');
var should = require('should');

//var markerSchema = mapdb.markerSchema;  //export schema
//var mapMarkerTestModel = mongoose.model('mapMarkerForTest', markerSchema); //dependency injection

describe('test message model', function() {
    // before and after each function, clean the database.
    before(function (done) {
        if (mongoose.connection.db) {
            mapdb.destroy(function(err) {
                              if(err) {
                                  console.log(err);
                              }
                          });
            mongoose.connection.close(function() {
                db = mongoose.connect(config.testMongoUrl, done);
            });
        } else {
            db = mongoose.connect(config.testMongoUrl, done);
        }
    });

    after(function(done) {
        if (mongoose.connection.db) {
            mapdb.destroy(function(err) {
                              if(err) {
                                  console.log(err);
                              }
                              mongoose.connection.close(done);
                          });
        }
    });

    beforeEach(function (done) {
        if (mongoose.connection.db) {
            mapdb.destroy(function(err) {
                              if(err) {
                                  console.log(err);
                              }
                              done();
                          });
        }
    });

    it('Adding a marker to an empty db successfully', function(done) {
      var fakeMarker = {lat: 66.666, lng: -6.666, title: "TestMarker", message: "TestMarker"};
      mapdb.addMarkerInfo(fakeMarker.lat,
                          fakeMarker.lng,
                          fakeMarker.title,
                          fakeMarker.message,
                          function(err, doc) {
                              assert.equal(null, err);
                              assert.equal(fakeMarker.lat, doc.lat);
                              assert.equal(fakeMarker.lng, doc.lng);
                              assert.equal(fakeMarker.title, doc.title);
                              assert.equal(fakeMarker.message, doc.message);
                              done();
                          });
    });

    it('Adding a marker and getting marker info successfully', function(done) {
      var fakeMarker = {lat: 12.345, lng: -132.54, title: "TestMarker", message: "TestMarker"};
      mapdb.addMarkerInfo(fakeMarker.lat,
                          fakeMarker.lng,
                          fakeMarker.title,
                          fakeMarker.message,
                          function(err, doc) {
                              mapdb.getMarkerInfo(function (err, docs) {
                                  assert.equal(null, err);
                                  assert.equal(1, docs.length);
                                  assert.equal(fakeMarker.lat, docs[0].lat);
                                  assert.equal(fakeMarker.lng, docs[0].lng);
                                  assert.equal(fakeMarker.title, docs[0].title);
                                  assert.equal(fakeMarker.message, docs[0].message);
                                  done();
                                });
                          });
    });

    it('Add two markers and delete one, then only get one marker', function(done) {
      var fakeMarker1 = {lat: 12.345, lng: -132.54, title: "TestMarker1", message: "TestMarker1"};
      mapdb.addMarkerInfo(fakeMarker1.lat,
                          fakeMarker1.lng,
                          fakeMarker1.title,
                          fakeMarker1.message,
                          function(err, doc) {
                            var fakeMarker2 = {lat: 66.666, lng: -6.666, title: "TestMarker2", message: "TestMarker2"};
                            mapdb.addMarkerInfo(fakeMarker2.lat,
                                                fakeMarker2.lng,
                                                fakeMarker2.title,
                                                fakeMarker2.message,
                                                function(err, doc) {
                                                  //first get, ensure 2 markers are stored
                                                  mapdb.getMarkerInfo(function (err, docs) {
                                                      assert.equal(null, err);
                                                      assert.equal(2, docs.length);
                                                      //remove first marker
                                                      mapdb.removeMarkerInfo(fakeMarker1.title,
                                                          function(err, msg) {
                                                            //second get, only marker2 left
                                                            mapdb.getMarkerInfo(function (err, docs) {
                                                                assert.equal(null, err);
                                                                assert.equal(1, docs.length);
                                                                assert.equal(fakeMarker2.lat, docs[0].lat);
                                                                assert.equal(fakeMarker2.lng, docs[0].lng);
                                                                assert.equal(fakeMarker2.title, docs[0].title);
                                                                assert.equal(fakeMarker2.message, docs[0].message);
                                                                done();
                                                              });
                                                          });
                                                    });
                                                });
                          });
    });

}); //test suite
