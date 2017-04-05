/**
 * Created by sxh on 16/11/12.
 */

var mongoose = require('mongoose');
var config = require('../config');
var group = require('../models/group');
var groupModel = group.groupModel;
var assert = require('assert');

mongoose.Promise = global.Promise;

describe('test group DB', function() {

    before(function (done) {
        if (mongoose.connection.db) {


            group.destroy(function(err) {
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


            group.destroy(function(err) {
                if(err) {
                    console.log(err);
                }
                mongoose.connection.close(done);
            });

        }

    });

    beforeEach(function (done) {
        if (mongoose.connection.db) {


            group.destroy(function(err) {
                if(err) {
                    console.log(err);
                }
                done();
            });

        }
    });

    //test find()
    it('test find function DB', function(done) {

        group.addMessage('', 'sxh', 'groupmem', 'food', 'offer', function (err, msg) {
            group.addMessage('', 'sxh', 'groupmem', 'water', 'offer', function (err, msg) {
                assert.equal(null, err);
                groupModel.find({}, function (err, docs) {
                    assert.equal(docs.length, 2);
                    done();
                });
            });
        });

    });

    //test distinct()
    it('test distinct function DB', function(done) {

        group.addMessage('', 'sxh', 'groupmem', 'food', 'offer', function (err, msg) {
            group.addMessage('', 'sxh', 'groupmem', 'water', 'offer', function (err, msg) {
                group.addMessage('', 'sxh1', 'groupmem', 'food', 'offer', function (err, msg) {
                    assert.equal(null, err);
                    groupModel.distinct('grouptag', {
                        messageType: 'groupmem'
                    }, function(err, groups) {
                        assert.equal(groups.length, 2);
                        done();
                    });
                });
            });
        });

    });

    //test findOne()
    it('test findOne function DB', function(done) {

        group.addMessage('', 'sxh', 'groupmem', 'food', 'offer', function (err, msg) {
            group.addMessage('', 'sxh', 'groupmem', 'water', 'offer', function (err, msg) {
                assert.equal(null, err);
                groupModel.findOne({
                    author: 'sxh',
                    grouptag: 'food',
                    messageType: 'groupmem'
                }, function(err, msg){
                    assert.equal(msg.author, 'sxh');
                    done();
                });
            });
        });

    });

    //test save()
    it('test save function DB', function() {
        var newMessage = new groupModel();
        newMessage.content = 'hi';
        newMessage.author = 'sxh';
        newMessage.messageType = 'groupmes';
        newMessage.grouptag = 'food';
        newMessage.identity = '';

        newMessage.save(function(err, savedMsg) {
            assert.equal(null, err);
            assert.equal('hi', savedMsg.content);
            assert.equal('sxh', savedMsg.author);
            assert.equal('groupmes', savedMsg.messageType);
        });
    });


});
