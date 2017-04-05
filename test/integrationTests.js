var message = require('../models/message');
var user = require('../models/user');
var mapdb = require('../models/map');
var maildb = require('../models/mail');
var mongoose = require('mongoose');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var chaiHttp = require('chai-http');
var config = require('../config.js');
var CryptoJS = require('crypto-js');
chai.use(chaiHttp);

var server = require('../server');
var HOST = 'http://localhost:' + config.port;

describe('REST API testing - ', function() {

    before(function(done) {
        server.start();

        if (mongoose.connection.db) {
            message.destroy(function(err) {
                if (err) {
                    console.log(err);
                }
            });
            user.destroy(function(err) {
                if(err) {console.log(err);}
            });
            maildb.destroy(function(err) {
                if (err) {
                    console.log(err);
                }
            });
            mapdb.destroy(function(err) {
                if(err) {console.log(err);}
            });
            mongoose.connection.close(function() {
                db = mongoose.connect(config.testMongoUrl, done);
            });
        } else {
            db = mongoose.connect(config.testMongoUrl, done);
        }
    });

    after(function(done) {
        server.close();
        if (mongoose.connection.db) {
            message.destroy(function(err) {
                if (err) {
                    console.log(err);
                }
                user.destroy(function(err) {
                  if(err) { console.log(err);}
		  maildb.destroy(function(err) {
                        if (err) {
                            console.log(err);
                        }
                        //mongoose.connection.close(done);
			mapdb.destroy(function(err) {
                      		if(err) {console.log(err);}
                      		mongoose.connection.close(done);
                  	});
                    });
                  //mongoose.connection.close(done);
                });
            });
        }
    });

    it("POST Admin User Profile - setPrivilage Administrator", function(done) {
      user.addUser("alice", "123", "hmv", function(err, user) {
        chai.request(HOST)
        .post('/users/profile/privilage').send({
          target: "alice",
          privilage: "Administrator"

        }).end(function(err, res) {
          expect(err).to.be.null; // jshint ignore:line
          expect(res).to.have.status(200);
          done();
        });

      });
    });

    it("POST Admin User Profile - setPrivilage Citizen", function(done) {
      user.addUser("alice", "123", "hmv", function(err, user) {
        chai.request(HOST)
        .post('/users/profile/privilage').send({
          target: "alice",
          privilage: "Citizen"

        }).end(function(err, res) {
          expect(err).to.be.null; // jshint ignore:line
          expect(res).to.have.status(200);
          done();
        });

      });
    });

    it("POST Admin User Profile - setPrivilage Coordinator", function(done) {
      user.addUser("alice", "123", "hmv", function(err, user) {
        chai.request(HOST)
        .post('/users/profile/privilage').send({
          target: "alice",
          privilage: "Coordinator"

        }).end(function(err, res) {
          expect(err).to.be.null; // jshint ignore:line
          expect(res).to.have.status(200);
          done();
        });

      });
    });

    it("POST Admin User Profile - setUsername", function(done) {
      user.addUser("alice", "123", "hmv", function(err, user) {
        chai.request(HOST)
        .post('/users/profile/username').send({
          target: "alice",
          newname: "wonderland"

        }).end(function(err, res) {
          expect(err).to.be.null; // jshint ignore:line
          expect(res).to.have.status(200);
          done();
        });

      });
    });

    it("POST Admin User Profile - setPassword", function(done) {
      user.addUser("alice", "123", "hmv", function(err, user) {
        chai.request(HOST)
        .post('/users/profile/password').send({
          target: "alice",
          password: "myNewPassword"

        }).end(function(err, res) {
          expect(err).to.be.null; // jshint ignore:line
          expect(res).to.have.status(201);
          done();
        });

      });
    });

    it("POST editUserProfile", function(done) {
      user.addUser("pz", "123", "hmv", function(err, user) {
        chai.request(HOST)
        .post('/users/profile').send({
          username: "pz",
          profile: {
            name: "PZ",
            address: "123 high way",
            phoneNumber: "58812304123"
          },
          filename: "uploads/src/img-0003.png"

        }).end(function(err, res) {
          // expect(res.body).to.have.property('user');
          // expect(err).to.be.null; // jshint ignore:line
          expect(res).to.have.status(200);
          done();
        });

      });
    });

    it('GET findUserProfile', function(done) {
        user.addUser("pz", "123", "hmv", function(err, user) {
            chai.request(HOST)
                .get('/users/profile/' + user.username)
                .send(user)
                .end(function(err, res) {
                    expect(res.body).to.have.property('profile');
                    expect(err).to.be.null; // jshint ignore:line
                    expect(res).to.have.status(200);
                    done();
                });
        });

    });

    //test 1
    it('POST public message', function(done) {

        chai.request(HOST)
            .post('/messages/public')
            //.query({author : 'testUser', content : 'this is a public message POST request'})
            .send({
                author: 'testUser',
                content: 'this is a public message POST request'
            })
            .end(function(err, res) {
                expect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(200);
                done();
            });

    });

    it('GET public messages', function(done) {

      chai.request(HOST)
          .get('/messages/public')
          //.query({author : 'testUser', content : 'this is a public message POST request'})
          .send({})
          .end(function (err, res) {
             expect(err).to.be.null; // jshint ignore:line
             expect(res).to.have.status(200);
             done();
          });
    });

    it('POST private message', function(done) {
        chai.request(HOST)
            .post('/messages/private')
            //.query({author : 'testUser', content : 'this is a public message POST request'})
            .send({
                target: 'testUserOne',
                author: 'testUserTwo',
                content: 'this is a private message POST request'
            })
            .end(function(err, res) {
                expect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(200);
                done();
            });
    });

    it('GET unread messages', function(done) {
      chai.request(HOST)
          .post('/messages/private')
          //.query({author : 'testUser', content : 'this is a public message POST request'})
          .send({target : 'testUserOne', author : 'testUserTwo', content : 'this is a private message POST request'})
          .end(function (err, res) {

            chai.request(HOST)
                  .get('/messages/private/unread')
                  //.query({author : 'testUser', content : 'this is a public message POST request'})
                  .send({target : 'testUserOne'})
                  .end(function (err, res) {
                     expect(err).to.be.null; // jshint ignore:line
                     expect(res).to.have.status(200);
                     done();
            });
          });
    });

    it('POST announcement', function(done) {

        chai.request(HOST)
            .post('/announcements')
            .send({
                author: 'testUser',
                content: 'this is a announcement POST request'
            })
            .end(function(err, res) {
                expect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(200);
                done();
            });

    });

    it('GET findUsers', function(done) {

        chai.request(HOST)
            .get('/users')
            .send({
                username: 'newUser',
                password: 'newPassword'
            })
            .end(function(err, res) {
                expect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(200);
                done();
            });

    });


    it('POST failed login', function(done) {
        var credentials = {
            username: 'newUser',
            password: 'newPassword'
        };
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(credentials.password), 'secret key 666').toString();
        var c_credentials = JSON.parse(JSON.stringify(credentials));
        c_credentials.password = ciphertext;
        chai.request(HOST)
            .post('/users')
            .send(c_credentials)
            .end(function(err, res) {
                expect(err).to.be.null; // jshint ignore:line
                expect(res.body.message).to.equal("auth-not-username");
                expect(res).to.have.status(200);
                done();
            });
    });

    it('POST signup', function(done) {
        var credentials = {
            username: 'newUser',
            password: 'newPassword'
        };
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(credentials.password), 'secret key 666').toString();
        var c_credentials = JSON.parse(JSON.stringify(credentials));
        c_credentials.password = ciphertext;
        chai.request(HOST)
            .post('/users/signup')
            .send(c_credentials)
            .end(function(err, res) {
                expect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(201);
                done();
            });
    });


        it('POST successful login', function(done) {
            var credentials = {
                username: 'newUser',
                password: 'newPassword'
            };
            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(credentials.password), 'secret key 666').toString();
            var c_credentials = JSON.parse(JSON.stringify(credentials));
            c_credentials.password = ciphertext;
            chai.request(HOST)
                .post('/users/signup')
                .send(c_credentials)
                .end(function(err, res) {
                    expect(err).to.be.null; // jshint ignore:line
                    expect(res).to.have.status(201);
                    chai.request(HOST)
                        .post('/users')
                        .send(c_credentials)
                        .end(function(err, res) {
                            expect(err).to.be.null; // jshint ignore:line
                            expect(res.body.message).to.equal("auth-login-success");
                            expect(res).to.have.status(200);
                            done();
                        });
                });
        });


    it('POST search statuses, found status', function(done) {
        var credentials = {
            username: 'newUser',
            password: 'newPassword'
        };
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(credentials.password), 'secret key 666').toString();
        var c_credentials = JSON.parse(JSON.stringify(credentials));
        c_credentials.password = ciphertext;
        chai.request(HOST)
            .post('/users/signup')
            .send(c_credentials)
            .end(
                function(err, res) {
                    chai.request(HOST)
                        .post('/searchinfo/status')
                        .send({
                            'status': 'N/A'
                        })
                        .end(function(err, res) {
                            expect(err).to.be.null; // jshint ignore:line
                            expect(res).to.have.status(200);
                            done();
                        });
                }
            );
    });

    it('POST search statuses, no statuses', function(done) {
        chai.request(HOST)
            .post('/searchinfo/status')
            .send({
                status: 'OK'
            })
            .end(function(err, res) {
                expect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(200);
                done();
            });
    });

    it('POST search users, found user', function(done) {
        var credentials = {
            username: 'newUser',
            password: 'newPassword'
        };
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(credentials.password), 'secret key 666').toString();
        var c_credentials = JSON.parse(JSON.stringify(credentials));
        c_credentials.password = ciphertext;
        chai.request(HOST)
            .post('/users/signup')
            .send(c_credentials)
            .end(
                function(err, res) {
                    chai.request(HOST)
                        .post('/searchinfo/name')
                        .send({
                            'part of username': 'new'
                        })
                        .end(function(err, res) {
                            expect(err).to.be.null; // jshint ignore:line
                            expect(res).to.have.status(200);
                            done();
                        });
                }
            );
    });

    it('POST search users, no user', function(done) {
        chai.request(HOST)
            .post('/searchinfo/name')
            .send({
                'part of username': 'me'
            })
            .end(function(err, res) {
                expect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(200);
                done();
            });
    });

    it('POST search announcements', function(done) {
        chai.request(HOST)
            .post('/announcements')
            .send({
                author: 'testUser',
                content: 'this is a announcement POST request'
            })
            .end(
                function(err, res) {
                    chai.request(HOST)
                        .post('/searchinfo/announcements')
                        .send({
                            'words': ['request']
                        })
                        .end(function(err, res) {
                            expect(err).to.be.null; // jshint ignore:line
                            expect(res).to.have.status(200);
                            done();
                        });
                }
            );
    });

    it('POST search announcements, no announcements', function(done) {
        chai.request(HOST)
            .post('/searchinfo/announcements')
            .send({
                'words': ['mymessage']
            })
            .end(function(err, res) {
                expect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(200);
                done();
            });
    });

    it('POST search public Messages, found message', function(done) {
        chai.request(HOST)
            .post('/messages/public')
            .send({
                author: 'testUser',
                content: 'this is a public message'
            })
            .end(
                function(err, res) {
                    chai.request(HOST)
                        .post('/searchinfo/public')
                        .send({
                            'words': ['message']
                        })
                        .end(function(err, res) {
                            expect(err).to.be.null; // jshint ignore:line
                            expect(res).to.have.status(200);
                            done();
                        });
                }
            );
    });

    it('POST search Public Messages, no message', function(done) {
        chai.request(HOST)
            .post('/searchinfo/public')
            .send({
                'words': ['message']
            })
            .end(function(err, res) {
                expect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(200);
                done();
            });
    });

    it('POST search Private Messages, found a message', function(done) {
        chai.request(HOST)
            .post('/messages/private')
            .send({
                author: 'alice',
                target: 'bob',
                content: 'this is a private message'
            })
            .end(
                function(err, res) {
                    chai.request(HOST)
                        .post('/searchinfo/private')
                        .send({
                            username: 'alice',
                            'words': ['message']
                        })
                        .end(function(err, res) {
                            expect(err).to.be.null; // jshint ignore:line
                            expect(res).to.have.status(200);
                            done();
                        });
                }
            );
    });

    //test map rest api
    it('POST marker info', function(done) {
      chai.request(HOST)
          .post('/map/markers')
          .send({lat: 37.7314, lng: -119.6489, title: "Yosemite", message: "Yosemite"})
          .end(function (err, res) {
             expect(err).to.be.null; // jshint ignore:line
             expect(res).to.have.status(200);
             done();
          });
    });

    it('POST marker info failed', function(done) {
      chai.request(HOST)
          .post('/map/markers')
          .send({lat: NaN, lng: NaN, message: ""})
          .end(function (err, res) {
             //expect(err).to.be.null; // jshint ignore:line
             expect(res).to.have.status(500);
             done();
          });
    });

    it('GET marker info', function(done) {
      chai.request(HOST)
          .get('/map/markers')
          //.send({lat: 37.7314, lng: -119.6489, message: "Yosemite"})
          .end(function (err, res) {
             expect(err).to.be.null; // jshint ignore:line
             expect(res).to.have.status(200);
             done();
          });
    });

    it('DELETE existing marker info', function(done) {
      chai.request(HOST)
          .post('/map/markers')
          .send({lat: -13.08, lng: -72.30, title: "Machu Picchu", message: "Machu Picchu"})
          .end(function (err, res) {
            chai.request(HOST)
                .del('/map/markers')
                .set('Content-type', 'application/json;charset=utf-8')
                .send({'id': 'Machu Picchu'})
                //.send({lat: 37.7314, lng: -119.6489, message: "Yosemite"})
                .end(function (err, res) {
                   expect(err).to.be.null; // jshint ignore:line
                   expect(res).to.have.status(200);
                   expect(res.body).to.eql({ "ok": 1, "n": 1 });  //delete 1 item
                   done();
                });
          });
    });

    it('inmails', function(done) {
        chai.request(HOST)
            .post('/mails/inmails')
            .send({
                to: "fengnan"
            })
            .end(function(err, res) {
                expect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(200);
                done();
            });
    });

    it('inmails', function(done) {
        chai.request(HOST)
            .post('/mails/inmails')
            .send({
                to: "fake"
            })
            .end(function(err, res) {
                expect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(200);
                done();
            });
    });

    it('sentmails', function(done) {
        chai.request(HOST)
            .post('/mails/sentmails')
            .send({
                from: "fengnan"
            })
            .end(function(err, res) {
                expect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(200);
                done();
            });
    });

    it('add mail', function(done) {
        chai.request(HOST)
            .post('/mails/')
            .send({
                from: "fengnan",
                to: "666",
                subject: "yoooo",
                body: "whatsup"
            })
            .end(function(err, res) {
                expect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(200);
                done();
            });
    });

    it('add same mail', function(done) {
        chai.request(HOST)
            .post('/mails/')
            .send({
                from: "fengnan",
                to: "666",
                subject: "yoooo",
                body: "whatsup"
            })
            .end(function(err, res) {
                expect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(200);
                done();
            });
    });

    it('sentmails', function(done) {
        chai.request(HOST)
            .post('/mails/sentmails')
            .send({
                from: "fake"
            })
            .end(function(err, res) {
                expect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(200);
                done();
            });
    });

    it('DELETE mail', function(done) {
        chai.request(HOST)
            .post('/mails/')
            .send({
                from: "fengnan",
                to: "666",
                subject: "yoooo",
                body: "whatsup"
            })
            .end(function(err, res) {
                chai.request(HOST)
                    .post('/mails/delete')
                    .set('Content-type', 'application/json;charset=utf-8')
                    .send({
                        from: "fengnan",
                        to: "666",
                        subject: "yoooo",
                        body: "whatsup"
                    })
                    .end(function(err, res) {
                        expect(err).to.be.null; // jshint ignore:line
                        expect(res).to.have.status(200);
                        done();
                    });
            });
    });

    it('DELETE mail which does not exist', function(done) {
        chai.request(HOST)
            .post('/mails/')
            .send({
                from: "fengnan",
                to: "666",
                subject: "yoooo",
                body: "whatsup"
            })
            .end(function(err, res) {
                chai.request(HOST)
                    .post('/mails/delete')
                    .set('Content-type', 'application/json;charset=utf-8')
                    .send({
                        from: "fake",
                        to: "fake",
                        subject: "fake",
                        body: "fake"
                    })
                    .end(function(err, res) {
                        expect(err).to.be.null; // jshint ignore:line
                        expect(res).to.have.status(200);
                        done();
                    });
            });
    });


    it('GET groups', function(done) {
        chai.request(HOST)
            .get('/groupin')
            .end(function (err, res) {
                //xpect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(200);
                done();
            });
    });

    it('GET offers', function(done) {
        chai.request(HOST)
            .get('/groupchat/offers')
            .end(function (err, res) {
                //expect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(200);
                done();
            });
    });

    it('GET needers', function(done) {
        chai.request(HOST)
            .get('/groupchat/needers')
            .end(function (err, res) {
                //expect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(200);
                done();
            });
    });

    it('GET messages', function(done) {
        chai.request(HOST)
            .get('/groupchat/messages')
            .end(function (err, res) {
                //expect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(200);
                done();
            });
    });

    it('GET noidentities', function(done) {
        chai.request(HOST)
            .get('/groupchat/noidentities')
            .end(function (err, res) {
                //expect(err).to.be.null; // jshint ignore:line
                expect(res).to.have.status(200);
                done();
            });
    });


});
