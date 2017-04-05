var mongoose = require('mongoose');
var config = require('../config');
var announce = require('../models/announce');
var announceModel = announce.announceModel;
var assert = require('assert');

mongoose.Promise = global.Promise;

describe('test announce DB', function() {

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
    it('test adding announcements DB', function() {
        var newMessage = new announceModel();
        newMessage.content = 'hi';
        newMessage.author = 'sxh';
        newMessage.postedAt = Date.now();

        newMessage.save(function(err, savedMsg) {
            assert.equal(null, err);
            assert.equal('hi', savedMsg.content);
            assert.equal('sxh', savedMsg.author);
        });
        /*
         announce.addAnnouncement('help again', 'sxh', function (err, msg) {
         assert.equal(null, err);
         done();
         });
         */
    });

    it('test find announcements DB', function(done) {

        announce.addAnnouncement('help again', 'sxh', function (err, msg) {
            assert.equal(null, err);
            announceModel.find({}, function (err, docs) {
                assert.equal(docs.length, 1);
                done();
            });
        });

    });

});
