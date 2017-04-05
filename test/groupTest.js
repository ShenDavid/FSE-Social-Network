/**
 * Created by sxh on 16/11/12.
 */

var mongoose = require('mongoose');
var config = require('../config');
var group = require('../models/group');
var assert = require('assert');


/* Connect to the DB */

describe('test group model', function() {

    // before and after each function, clean the database.
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

    //test findGroups()
    it('test findGroups function', function(done) {

        group.addMessage('', 'sxh', 'groupmem', 'food', 'offer', function (err, msg) {
            group.addMessage('', 'sxh', 'groupmem', 'water', 'offer', function (err, msg) {
                group.addMessage('', 'sxh1', 'groupmem', 'food', 'offer', function (err, msg) {
                    assert.equal(null, err);
                    group.findGroups(function(err, groups) {
                        assert.equal(groups.length, 2);
                        done();
                    });
                });
            });
        });

    });

    //test findOneUser()
    it('test findOneUser function', function(done) {

        group.addMessage('', 'sxh', 'groupmem', 'food', 'offer', function (err, msg) {
            group.addMessage('', 'sxh', 'groupmem', 'water', 'offer', function (err, msg) {
                group.addMessage('', 'sxh1', 'groupmem', 'food', 'offer', function (err, msg) {
                    assert.equal(null, err);
                    group.findOneUser('sxh', 'food', function(err, group) {
                        assert.equal(group.identity, 'offer');
                        done();
                    });
                });
            });
        });

    });

    //test findNeeders()
    it('test findNeeders function', function(done) {

        group.addMessage('', 'sxh', 'groupmem', 'food', 'offer', function (err, msg) {
            group.addMessage('', 'xh3', 'groupmem', 'food', 'needer', function (err, msg) {
                group.addMessage('', 'sxh1', 'groupmem', 'food', 'offer', function (err, msg) {
                    assert.equal(null, err);
                    group.findNeeders('food', function(err, groups) {
                        assert.equal(groups.length, 1);
                        done();
                    });
                });
            });
        });

    });

    //test findProviders()
    it('test findProviders function', function(done) {

        group.addMessage('', 'sxh', 'groupmem', 'food', 'offer', function (err, msg) {
            group.addMessage('', 'xh3', 'groupmem', 'food', 'needer', function (err, msg) {
                group.addMessage('', 'sxh1', 'groupmem', 'food', 'offer', function (err, msg) {
                    assert.equal(null, err);
                    group.findProviders('food', function(err, groups) {
                        assert.equal(groups.length, 2);
                        done();
                    });
                });
            });
        });

    });

    //test findMessages()
    it('test findMessages function', function(done) {

        group.addMessage('hi', 'sxh', 'groupmes', 'food', 'offer', function (err, msg) {
            group.addMessage('getout', 'sxh', 'groupmes', 'water', 'offer', function (err, msg) {
                group.addMessage('', 'sxh1', 'groupmem', 'food', 'offer', function (err, msg) {
                    assert.equal(null, err);
                    group.findMessages('food', function(err, groups) {
                        assert.equal(groups.length, 1);
                        done();
                    });
                });
            });
        });

    });

    //test addMessage
    it('test adding messages', function(done) {
        group.addMessage('help again', 'sxh','groupmes', 'food', 'needer', function (err, msg) {
            assert.equal(null, err);
            assert.equal(msg.content, 'help again');
            done();
        });
    });

    //test updateIdentity()
    it('test updateIdentity function', function(done) {

        group.addMessage('', 'sxh', 'groupmem', 'food', 'offer', function (err, msg) {
            group.addMessage('', 'sxh', 'groupmem', 'water', 'offer', function (err, msg) {
                group.addMessage('', 'sxh1', 'groupmem', 'food', 'offer', function (err, msg) {
                    assert.equal(null, err);
                    group.updateIdentity('sxh', 'groupmes','food', 'needer',function(err, group) {
                        assert.equal(group.identity, 'needer');
                        done();
                    });
                });
            });
        });

    });

});
