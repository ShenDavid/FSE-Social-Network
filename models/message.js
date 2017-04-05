var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    content: String,
    author: String,
    messageType: String,
    target: String,
    postedAt: {
        type: Date,
        default: Date.now
    },
    read: Boolean,
    messageID: mongoose.Schema.Types.ObjectId
});

var messageModel = exports.messageModel = mongoose.model('Message', messageSchema);

//retrieve
var findPublicMessagesByAuthor = exports.findPublicMessageByAuthor = function(name, callback) {
    messageModel.find({
            author: name,
            messageType: "WALL"
        },
        callback
    );
};

exports.findPublicMessagesByWords = function(words, callback) {
    var regex = ".*";
    for (i = 0; i < words.length; i++) {
        if (words[i].length === 0) continue;
        regex = regex = "(?=.*\\b" + words[i] + "\\b)";
    }
    regex += ".*";
    if (words.length === 0) {
        regex = ".^";
    }
    messageModel.find({
        messageType: 'WALL',
        content: new RegExp(regex, "i")
    }).sort({
        postedAt: 'desc'
    }).exec(callback);
};

exports.findPrivateMessagesByWords = function(username, words, callback) {
    var regex = ".*";
    for (i = 0; i < words.length; i++) {
        if (words[i].length === 0) continue;
        regex = regex = "(?=.*\\b" + words[i] + "\\b)";
    }
    regex += ".*";
    if (words.length === 0) {
        regex = ".^";
    }
    messageModel.find({
        $or: [{
            author: username
        }, {
            target: username
        }],
        messageType: 'Private',
        content: new RegExp(regex, "i")
    }).sort({
        postedAt: 'desc'
    }).exec(callback);
};

exports.findPrivateMessages = function(authorname, targetname, callback) {
    var msgs = [];
    messageModel.find({
        author: authorname,
        target: targetname
    }, function(err, obj) {

        msgs = msgs.concat(obj);

    });

    messageModel.find({
        author: targetname,
        target: authorname
    }, function(err, obj) {

        msgs = msgs.concat(obj);
        msgs = msgs.sort({
            postedAt: 'descending'
        });
        callback(null, msgs);

    });
};

exports.findPublicMessages = function(callback) {
    messageModel.find({
        messageType: "WALL"
    }, callback);
};


//create
exports.addMessage = function(content, author, messageType, target, callback) {
    var newMessage = new messageModel();
    newMessage.content = content;
    newMessage.author = author;
    newMessage.messageType = messageType;
    newMessage.target = target;
    newMessage.read = false;

    newMessage.save(callback);
};

//
exports.readMessages = function(author, target, callback) {
    messageModel.update({
            author: author,
            target: target
        }, {
            read: true
        }, {
            multi: true
        },
        callback
    );
};

exports.unreadMessages = function(target, callback) {
    console.log('message.js unread message');
    messageModel.distinct('author', {
        author: {
            $ne: null
        },
        target: target,
        read: false
    }, function(err, authors) {
        console.log(err);
        console.log(authors);
        callback(err, authors);
    });
};
//module.exports = MongooseDao;

exports.destroy = function(callback) {
    messageModel.remove({}, callback);
};
