var mongoose = require('mongoose');
var config = require('../config');
var message = require('../models/message');
var messageModel = message.messageModel;
var assert = require('assert');
var should = require('should');

describe('test message DB', function() {

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

    it('Adding a public message to an empty db', function() {
        var newMessage = new messageModel();
        newMessage.content = 'Hello World';
        newMessage.author = 'alice';
        newMessage.messageType = 'WALL';
        newMessage.target = '';
        newMessage.read = false;
        //newMessage.save(callback);

        newMessage.save(function(err, msg) {


            assert.equal(null, err);
            assert.equal('alice', msg.author);
            assert.equal('Hello World', msg.content);
            assert.equal('WALL', msg.messageType);
            assert.equal('', msg.target);
        });
    });

    it('Adding a private message to an empty db', function(done) {
        var newMessage = new messageModel();
        newMessage.content = 'Hello World';
        newMessage.author = 'alice';
        newMessage.messageType = 'Private';
        newMessage.target = 'bob';
        newMessage.read = false;
        //newMessage.save(callback);

        newMessage.save(function(err, msg) {

            assert.equal(null, err);
            assert.equal('alice', msg.author);
            assert.equal('Hello World', msg.content);
            assert.equal('Private', msg.messageType);
            assert.equal('bob', msg.target);
            done();
        });
    });

    it('findPublicMessages gets only public messages', function (done) {
        message.addMessage('Great Thursday', 'alice', 'Private', 'chris', function (err, msg) {
            //message.addMessage('Hello bob', 'alice', 'Private', 'bob', function (err, msg) {

            message.addMessage('Beautiful Day', 'alice', 'WALL', '', function (err, msg) {

                //return message.findPublicMessages().should.have.length(1);
                messageModel.find({
                    author: 'alice',
                    messageType: "WALL"
                }, function(err, docs) {
                    assert.equal('Beautiful Day', docs[0].content);
                    done();
                });
            });
            // })
        });
    });

    it('findPrivateMessagesByWords, message found', function (done) {
        message.addMessage('Great Thursday', 'alice', 'Private', 'chris', function (err, msg) {
            message.addMessage('Hello bob', 'alice', 'Private', 'bob', function (err, msg) {
              message.addMessage('Beautiful Day', 'alice', 'WALL', '', function (err, msg) {
                  message.findPrivateMessagesByWords('alice',['Great'], function(err, docs) {
                      assert.equal('Great Thursday', docs[0].content);
                      done();
                  });
              });
            });
        });
    });

    it('findPrivateMessagesByWords, message not found', function (done) {
        message.addMessage('Great Thursday', 'alice', 'Private', 'chris', function (err, msg) {
            message.addMessage('Hello bob', 'alice', 'Private', 'bob', function (err, msg) {
              message.addMessage('Beautiful Day', 'alice', 'WALL', '', function (err, msg) {
                  message.findPrivateMessagesByWords('alice',['BAD'], function(err, docs) {
                      assert.equal(docs.content, null);
                      done();
                  });
              });
            });
        });
    });

    it('findPrivateMessagesByWords, no words given', function (done) {
        message.addMessage('Great Thursday', 'alice', 'Private', 'chris', function (err, msg) {
            message.addMessage('Hello bob', 'alice', 'Private', 'bob', function (err, msg) {
              message.addMessage('Beautiful Day', 'alice', 'WALL', '', function (err, msg) {
                  message.findPrivateMessagesByWords('alice',[], function(err, docs) {
                      assert.equal(docs.content, null);
                      done();
                  });
              });
            });
        });
    });

    it('findPublicMessagesByWords, message found', function (done) {
        message.addMessage('Great Thursday', 'alice', 'Private', 'chris', function (err, msg) {
            message.addMessage('Hello bob', 'alice', 'Private', 'bob', function (err, msg) {
              message.addMessage('Beautiful Day', 'alice', 'WALL', '', function (err, msg) {
                  message.findPublicMessagesByWords(['Day'], function(err, docs) {
                      assert.equal('Beautiful Day', docs[0].content);
                      done();
                  });
              });
            });
        });
    });

    it('findPublicMessagesByWords, message not found', function (done) {
        message.addMessage('Great Thursday', 'alice', 'Private', 'chris', function (err, msg) {
            message.addMessage('Hello bob', 'alice', 'Private', 'bob', function (err, msg) {
              message.addMessage('Beautiful Day', 'alice', 'WALL', '', function (err, msg) {
                  message.findPublicMessagesByWords(['BAD'], function(err, docs) {
                      assert.equal(docs.content, null);
                      done();
                  });
              });
            });
        });
    });

    it('findPublicMessagesByWords, no words given', function (done) {
        message.addMessage('Great Thursday', 'alice', 'Private', 'chris', function (err, msg) {
            message.addMessage('Hello bob', 'alice', 'Private', 'bob', function (err, msg) {
              message.addMessage('Beautiful Day', 'alice', 'WALL', '', function (err, msg) {
                  message.findPublicMessagesByWords([], function(err, docs) {
                      assert.equal(docs.content, null);
                      done();
                  });
              });
            });
        });
    });


});
