/**
 * Created by sxh on 16/10/14.
 */

var user = require('../models/user');
var assert = require('assert');

var mongoose = require('mongoose');
var config = require('../config');

var chai = require('chai');
var chaiassert = chai.assert;

describe('test user model', function() {

    before(function (done) {
        if (mongoose.connection.db) {
            user.destroy(function(err) {
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
            user.destroy(function(err) {
                if(err) {
                    console.log(err);
                }
                mongoose.connection.close(done);
            });
        }
    });

    beforeEach(function (done) {
        if (mongoose.connection.db) {
            user.destroy(function(err) {
                if(err) {
                    console.log(err);
                }
                done();
            });

        }
    });
    //Test Edit User Profile
    it('test edit user profile', function(done) {
      user.addUser('jim', '666', 'werf', function(err, new_user) {
          user.editProfile(new_user.username, {name:"PZ", address:"123 high way", phoneNumber:"711", familyMembers: ["AAA", "BBB"]}, "/src/uploads/img-0002.png", function(err, editedUser) {
            assert.equal("PZ", editedUser.profile.name);
            assert.equal("123 high way", editedUser.profile.address);
            assert.equal("711", editedUser.profile.phoneNumber);
            assert.equal("AAA", editedUser.profile.familyMembers[0]);
            assert.equal("BBB", editedUser.profile.familyMembers[1]);
            assert.equal("/src/uploads/img-0002.png", editedUser.profile.imageUrl);
            done();

          });
      });
    });
    //Test Get Uer Profile
    it('test get user profile', function(done) {
      user.addUser('jim', '666', 'werf', function(err, user) {
          assert.equal('', user.profile.name);
          assert.equal('', user.profile.address);
          assert.equal('', user.profile.phoneNumber);
          assert.equal("/src/assets/github.png", user.profile.imageUrl);
          assert.equal(0, user.profile.familyMembers.length);
          done();
      });
    });
    //test adding user
    it('test adding user', function(done) {
        user.addUser('xh3', '666', 'werf', function(err, user) {
            assert.equal('xh3', user.username);
            done();
        });
    });

    //test findUserByName
    it('test findUserByName', function(done) {
        user.addUser('sxh', '666', 'werf', function(err, obj) {
            user.findUserByName('sxh', function(err, new_user) {
                assert.equal(null, err);
                assert.equal('sxh', new_user.username);
                done();
            });
        });
    });

    //test editStatusCode
    it('test editStatusCode', function(done) {
        user.addUser('sxh', '666', 'werf', function(err, res) {
            user.editStatusCode('GREEN', 'sxh', function(err, doc) {
                assert.equal(null, err);
                assert.equal('sxh', doc.username);
                assert.equal('GREEN', doc.lastStatusCode);
                done();
            });
        });
    });

    //test editAccountStatus
    it('test editAccountStatus', function(done){
        user.addUser('sxh', '666', 'werf', function(err, new_user) {

            user.editAccountStatus('sxh', 'Offline' , function (err, user){
                assert.equal(null, err);
                assert.equal('sxh', user.username);
                assert.equal('Offline', user.accountStatus);
                done();
            });
        });
    });

    //test findOfflineUsers
    it('test findOfflineUsers', function(done){
        user.addUser('sxh', '666', 'werf', function(err, new_user) {
            user.addUser('axh', '666', 'werf', function(err, new_user) {
                user.editAccountStatus('sxh', 'Offline' , function (err, new_user){
                    user.editAccountStatus('axh', 'Offline' , function (err, new_user){
                        user.findOfflineUsers(function (err, users) {
                            assert.equal(null, err);
                            assert.equal('axh', users[0].username);
                            assert.equal('sxh', users[1].username);
                            done();
                        });
                    });
                });
            });
        });
    });

    //test findOfflineUsers
    it('test findUsers', function(done){
        user.addUser('sxh', '666', 'werf', function(err, new_user) {
            user.addUser('axh', '666', 'werf', function(err, new_user) {

                    user.editAccountStatus('axh', 'Offline' , function (err, new_user){
                        user.findUsers(function (err, users) {
                            assert.equal(null, err);
                            assert.equal('sxh', users[0].username);
                            assert.equal('axh', users[1].username);
                            done();
                        });
                    });

            });
        });
    });

    //test findOnlineUsers
    it('test findOnlineUsers', function(done){
        user.addUser('sxh', '666', 'werf', function(err, new_user) {
            user.addUser('axh', '666', 'werf', function(err, new_user) {
                user.findOnlineUsers(function (err, users) {
                    assert.equal(null, err);
                    //assert.equal(1, users.length);
                    assert.equal('axh', users[0].username);
                    assert.equal('sxh', users[1].username);
                    done();
                });
            });
        });
    });

    //test editLoginTime
    it('test editLoginTime', function (done) {
        var prevtime;
        var nowtime;
        //done();
        user.addUser('sxh', '666', 'werf', function(err, new_user) {
            //done();
            user.editLoginTime('sxh', function (err, doc) {
                prevtime = doc.updatedAt;
                setTimeout(function(){
                user.editLoginTime('sxh', '', function (err, new_user) {
                    nowtime = new_user.updatedAt;
                        assert.notEqual(prevtime, nowtime);
                });
               }, 1500);
                done();
            });
        });
    });
});
