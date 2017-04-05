/**
 * Created by sxh on 16/10/23.
 */

var user = require('../models/user');
var userModel = user.userModel;
var assert = require('assert');

var mongoose = require('mongoose');
var config = require('../config');

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
    it('Edit Username', function(done) {
      var newUser = new userModel();
      newUser.username = 'alice';
      newUser.password = '666';
      newUser.salt = 'werf';

      newUser.profile.name = "PZ";
      newUser.profile.address = "123 cmu";

      newUser.save(function(err, myuser) {
        user.editUsername("alice", "wonderland", function(err, editedUser) {
          assert.equal(editedUser.username, "wonderland");
          done();
        });
      });
    });

    it('Privilage Default = Citizen', function(done) {
      var newUser = new userModel();
      newUser.username = 'alice';
      newUser.password = '666';
      newUser.salt = 'werf';
      newUser.save(function(err, myuser) {
          assert.equal(myuser.privilage, "Citizen");
          done();
      });

    });

    it('Active Default = true', function(done) {
      var newUser = new userModel();
      newUser.username = 'alice';
      newUser.password = '666';
      newUser.salt = 'werf';
      newUser.save(function(err, myuser) {
          assert.equal(myuser.active, true);
          done();
      });

    });

    it('test Edit Profile', function(done) {
      var newUser = new userModel();
      newUser.username = 'xh3';
      newUser.password = '666';
      newUser.salt = 'werf';

      newUser.profile.name = "PZ";
      newUser.profile.address = "123 cmu";
      newUser.profile.phoneNumber = "5177756456";
      newUser.profile.imageUrl = "/upload/image-0001.png";
      newUser.profile.familyMembers = ["BOB", "JIM"];

      newUser.save(function(err, user) {
        user.profile.name = "zpppp";
        user.profile.imageUrl ="/upload/image-0002.png";
        user.save(function(err, editedUser) {
          assert.equal(editedUser.profile.name, "zpppp");
          assert.equal(editedUser.profile.imageUrl, "/upload/image-0002.png");
          done();
        });
      });

    });

    //Test get Profile by username
    it('test get profile', function(done) {
      var newUser = new userModel();
      newUser.username = 'zp3';
      newUser.password = '666';
      newUser.salt = 'werf';

      newUser.profile.name = "PZ";
      newUser.profile.address = "123 cmu";
      newUser.profile.phoneNumber = "5177756456";
      newUser.profile.imageUrl = "/upload/image-0001.png";
      newUser.profile.familyMembers = ["BOB", "JIM"];

      newUser.save(function(err, user) {
        userModel.findOne({
          username: "zp3"
        }, function(err, obj) {
          assert.equal(null, err);
          assert.equal(obj.profile.name, "PZ");
          assert.equal(obj.profile.address, "123 cmu");
          assert.equal(obj.profile.phoneNumber, "5177756456");
          assert.equal(obj.profile.imageUrl, "/upload/image-0001.png");
          assert.equal(obj.profile.familyMembers[0], "BOB");
          assert.equal(obj.profile.familyMembers[1], "JIM");
          done();

        });
      });
    });

    //test adding user
    it('test adding user', function(done) {
        var newUser = new userModel();
        newUser.username = 'xh3';
        newUser.password = '666';
        newUser.salt = 'werf';
        newUser.accountStatus = "Online";

        newUser.save(function(err, user) {
            assert.equal('xh3', user.username);
            done();
        });
    });

    //test findUserByName
    it('test findUserByName', function(done) {
        user.addUser('sxh', '666', 'werf', function(err, new_user) {
            userModel.findOne({
                username: 'sxh'
            }, function(err, obj) {
                assert.equal(null, err);
                assert.equal('sxh', obj.username);
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
                        userModel.find({accountStatus: "Offline"}).sort({username: 'asc'}).exec(function(err, users) {
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

    //test findOnlineUsers
    it('test findOnlineUsers', function(done){
        user.addUser('sxh', '666', 'werf', function(err, new_user) {
            user.addUser('axh', '666', 'werf', function(err, new_user) {
                userModel.find({accountStatus: "Online"}).sort({username: 'asc'}).exec(function(err, users) {
                    assert.equal(null, err);
                    assert.equal('axh', users[0].username);
                    assert.equal('sxh', users[1].username);
                    done();
                });
            });
        });
    });

});
