var mongoose = require('mongoose');
var config = require('../config');
var message = require('../models/message');
var assert = require('assert');
var should = require('should');

describe('test message model', function() {

    // before and after each function, clean the database.
    before(function (done) {
        if (mongoose.connection.db) {
            message.destroy(function(err) {
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
            message.destroy(function(err) {
                if(err) {
                    console.log(err);
                }
                mongoose.connection.close(done);
            });
        }
    });

    beforeEach(function (done) {
        if (mongoose.connection.db) {
            message.destroy(function(err) {
                if(err) {
                    console.log(err);
                }
                done();
            });
        }
    });

    it('Adding a public message to an empty db', function(done) {
        message.addMessage('Hello World', 'alice', 'WALL', '', function (err, msg) {
            assert.equal(null, err);
            assert.equal('alice', msg.author);
            assert.equal('Hello World', msg.content);
            assert.equal('WALL', msg.messageType);
            assert.equal('', msg.target);
            done();
        });
    });

    it('Adding a private message to an empty db', function(done) {
        message.addMessage('Hello World', 'alice', 'Private', 'bob', function (err, msg) {
            assert.equal(null, err);
            assert.equal('alice', msg.author);
            assert.equal('Hello World', msg.content);
            assert.equal('Private', msg.messageType);
            assert.equal('bob', msg.target);
            done();
        });
    });

    it('Adding a 2 private messages to an empty db', function(done) {
        message.addMessage('Hello World', 'alice', 'Private', 'bob', function (err, msg) {
            done();
        });
    });

    it('findPrivateMessages gets multiple messages from both author and target', function(done) {
        message.addMessage('Hello bob', 'alice', 'Private', 'bob', function (err, msg) {
            message.addMessage('Hello alice', 'bob', 'Private', 'alice', function (err, msg) {
                message.addMessage('Beautiful Day', 'alice', 'Private', 'bob', function (err, msg) {
                    message.addMessage('Great Thursday', 'alice', 'Private', 'chris', function (err, msg) {

                        message.findPrivateMessages('alice','bob',
                            function(err,obj1) {
                                assert.equal(null, err);
                                // assert.equal(obj1.length, 3);

                                message.findPrivateMessages('bob','alice',
                                    function(err,obj2) {
                                        assert.equal(null, err);
                                        // assert.equal(obj2.length, 3);
                                        done();
                                    });
                            });
                    });
                });
            });
        });
    });

    it('findPrivateMessages does not get public messages', function(done) {
        message.addMessage('Hello bob', 'alice', 'Private', 'bob', function (err, msg) {
            message.addMessage('Beautiful Day', 'alice', 'WALL', '', function (err, msg) {
                message.addMessage('Great Thursday', 'alice', 'Private', 'chris', function (err, msg) {

                    message.findPrivateMessages('alice','bob',
                        function(err,obj) {
                            assert.equal(null, err);
                            done();
                        });
                });
            });
        });
    });

     it('findPublicMessages gets only public messages', function (done) {
       message.addMessage('Great Thursday', 'alice', 'Private', 'chris', function (err, msg) {
         message.addMessage('Hello bob', 'alice', 'Private', 'bob', function (err, msg) {
           message.addMessage('Beautiful Day', 'alice', 'WALL', '', function (err, msg) {
             message.findPublicMessages(function (err, docs) {
                 assert.equal(docs.length, 1);
                 done();
             });
           });
         });
       });
     });


    it('readMessages marks an unread message as read', function(done) {
        message.addMessage('Hello bob', 'alice', 'Private', 'bob',
            function (err, msg) {
                // read messages sends the callback an object formatted like { "ok" : 1, "nModified" : 1, "n" : 1 }
                message.readMessages('alice','bob',
                    function(err,data) {
                        if (err){done(err);}
                        else{done();}});
            });
    });

    it('readMessages marks an unread message as read', function(done) {
        message.addMessage('Beautiful Day', 'alice', 'WALL', '', function (err, msg) {
                // read messages sends the callback an object formatted like { "ok" : 1, "nModified" : 1, "n" : 1 }
                message.findPublicMessageByAuthor('alice',
                    function(err,data) {
                        if (err){done(err);}
                        else{done();}});
            });
    });

});
