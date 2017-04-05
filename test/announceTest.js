/**
 * Created by sxh on 16/10/14.
 */
var mongoose = require('mongoose');
var config = require('../config');
var announce = require('../models/announce');
var assert = require('assert');
/*
 var config = require('../config');
 var db = mongoose.connect(config.mongoUrl);

 mongoose.connection.on('open', function() {
 console.log('MongoDB connected successfully!');
 });
 */


/* Connect to the DB */

describe('test announce model', function() {

    // before and after each function, clean the database.
    before(function (done) {
        if (mongoose.connection.db) {
            announce.destroy(function(err) {
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
            announce.destroy(function(err) {
                if(err) {
                    console.log(err);
                }
                mongoose.connection.close(done);
            });
        }
    });

    beforeEach(function (done) {
        if (mongoose.connection.db) {
            announce.destroy(function(err) {
                if(err) {
                    console.log(err);
                }
                done();
            });
        }
    });

    //test adding announcements
    it('test adding announcements', function(done) {
        announce.addAnnouncement('help again', 'sxh', function (err, msg) {
            assert.equal(null, err);
            done();
        });
    });

     it('test find limited announcements', function(done) {
         announce.addAnnouncement('help again', 'sxh', function (err, msg) {
             announce.addAnnouncement('help again', 'sxh', function (err, msg) {
                 announce.addAnnouncement('help again', 'sxh', function (err, msg) {
                     announce.addAnnouncement('help again', 'sxh', function (err, msg) {
                         announce.addAnnouncement('help again', 'sxh', function (err, msg) {
                             announce.addAnnouncement('help again', 'sxh', function (err, msg) {
                                 announce.findLimitedAnnouncements(function(err, docs) {
                                     //limit is 5
                                     assert.equal(docs.length, 5);
                                     done();
                                 });
                             });
                         });
                     });
                 });
             });

         });
     });

    it('test find announcements', function(done) {

        announce.addAnnouncement('help again', 'sxh', function (err, msg) {
            assert.equal(null, err);
            announce.findAnnouncements(function(err, docs) {
                assert.equal(docs.length, 1);
                done();
            });
        });

    });

});
