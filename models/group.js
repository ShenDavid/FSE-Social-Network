/**
 * Created by sxh on 16/11/11.
 */

var mongoose = require('mongoose');

var groupSchema = mongoose.Schema({
    content: String,
    author: String,
    messageType: String,
    postedAt: {
        type: Date,
        default: Date.now
    },
    grouptag: String,
    identity: String
});

var groupModel = exports.groupModel = mongoose.model('Group', groupSchema);

//retrieve
exports.findGroups = function(callback) {

    groupModel.distinct('grouptag', {
        messageType: 'groupmem'
    }, function(err, groups) {
        callback(err, groups);
    });
};

exports.findOneUser = function(author, PPP, callback) {
    groupModel.findOne({
        author: author,
        grouptag: PPP,
        messageType: 'groupmem'
    }, function(err, msg){
        callback(err, msg);
    });
};

exports.findNeeders = function(PPP, callback) {

    groupModel.distinct('author', {
        messageType: 'groupmem',
        grouptag: PPP,
        identity: 'needer'
    }, function(err, groups) {
        callback(err, groups);
    });
};

exports.findProviders = function(PPP, callback) {

    groupModel.distinct('author', {
        messageType: 'groupmem',
        grouptag: PPP,
        identity: 'offer'
    }, function(err, groups) {
        callback(err, groups);
    });
};

exports.findMessages = function(PPP, callback) {
    //console.log("1st"+PPP);
    groupModel.find({
        messageType: 'groupmes',
        grouptag: PPP
    }, function(err, groups) {
        callback(err, groups);
    });
};

exports.findnoidentities = function(PPP, callback) {
    //console.log("1st"+PPP);
    groupModel.distinct('author', {
        messageType: 'groupmem',
        grouptag: PPP,
        identity: 'undefined'
    }, function(err, groups) {
        console.log(groups);
        callback(err, groups);
    });
};

//create
exports.addMessage = function(content, author, messageType, PPP, identity, callback) {
    var newMessage = new groupModel();
    newMessage.content = content;
    newMessage.author = author;
    newMessage.messageType = messageType;
    newMessage.grouptag = PPP;
    newMessage.identity = identity;

    newMessage.save(callback);
};

//update
exports.updateIdentity = function(author, messageType, PPP, identity, callback) {
    groupModel.findOne({
        author: author,
        grouptag: PPP,
        messageType: 'groupmem'
    }, function(err, doc){
        if (err)
            callback(err);
        else {
            var date = Date.now();
            doc.postedAt = date;
            doc.identity = identity;
            doc.save(callback);
        }
    });
};

exports.destroy = function(callback) {
    groupModel.remove({}, callback);
};
