var mongoose = require('mongoose');
var config = require('../config');
var maildb = require('../models/mail');
var assert = require('assert');
var should = require('should');

describe('test mail model', function() {
    // before and after each function, clean the database.
    before(function(done) {
        if (mongoose.connection.db) {
            maildb.destroy(function(err) {
                if (err) {
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
            maildb.destroy(function(err) {
                if (err) {
                }
                mongoose.connection.close(done);
            });
        }
    });

    beforeEach(function(done) {
        if (mongoose.connection.db) {
            maildb.destroy(function(err) {
                if (err) {
                }
                done();
            });
        }
    });

    it('Adding a mail to an empty db successfully', function(done) {
        var fakeMail = {
            from: "fengnan",
            to: "666",
            subject: "test",
            body: "test"
        };
        maildb.addMail(fakeMail.from,
            fakeMail.to,
            fakeMail.subject,
            fakeMail.body,
            function(err, doc) {
                assert.equal(null, err);
                assert.equal(fakeMail.from, doc.from);
                assert.equal(fakeMail.to, doc.to);
                assert.equal(fakeMail.subject, doc.subject);
                assert.equal(fakeMail.body, doc.body);
                done();
            });
    });

    it('Adding a mail and get inmail successfully', function(done) {
        var fakeMail = {
            from: "fengnan",
            to: "666",
            subject: "test",
            body: "test"
        };
        maildb.addMail(fakeMail.from,
            fakeMail.to,
            fakeMail.subject,
            fakeMail.body,
            function(err, doc) {
                maildb.findInMails("666", function(err, docs) {
                    assert.equal(null, err);
                    assert.equal(fakeMail.to, docs[0].to);
                    done();
                });
            });
    });

    it('Adding a mail and get sentmail successfully', function(done) {
        var fakeMail = {
            from: "fengnan",
            to: "666",
            subject: "test",
            body: "test"
        };
        maildb.addMail(fakeMail.from,
            fakeMail.to,
            fakeMail.subject,
            fakeMail.body,
            function(err, doc) {
                maildb.findSentMails("fengnan", function(err, docs) {
                    assert.equal(null, err);
                    assert.equal(fakeMail.from, docs[0].from);
                    done();
                });
            });
    });
    it('Adding a mail and delete successfully', function(done) {
        var fakeMail = {
            from: "fengnan",
            to: "666",
            subject: "test",
            body: "test"
        };
        maildb.addMail(fakeMail.from,
            fakeMail.to,
            fakeMail.subject,
            fakeMail.body,
            function(err, doc) {
                maildb.deleteMail("fengnan", "666", "test", "test", function(err, docs) {
                    assert.equal(null, err);
                    done();
                });
            });
    });

}); //test suite
