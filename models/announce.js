var mongoose = require('mongoose');

var announceSchema = mongoose.Schema({
    content: String,
    author: String,
    postedAt: {
        type: Date,
        default: Date.now
    },
    announceID: mongoose.Schema.Types.ObjectId
});

var announceModel = exports.announceModel = mongoose.model('Announce', announceSchema);

//retrieve
exports.findAnnouncements = function(callback) {
    announceModel.find({}, callback);
};

exports.findAnnouncementsByWords = function(words, callback) {
    var regex = ".*";
    for (i = 0; i < words.length; i++) {
      if (words[i].length === 0) continue;
      regex = regex = "(?=.*\\b" + words[i] + "\\b)";
    }
    regex += ".*";
    if (words.length === 0) {
      regex = ".^";
    }
    announceModel.find({
        content: new RegExp(regex, "i"),
    }).sort({
        postedAt: 'desc'
    }).exec(callback);
};

exports.findLimitedAnnouncements = function(callback) {
    announceModel.find({}).sort({postedAt: -1}).limit(5).exec(function (err, docs) {
        callback(null, docs);
    });
};


//create
exports.addAnnouncement = function(content, author, callback) {
    var newMessage = new announceModel();
    newMessage.content = content;
    newMessage.author = author;
    newMessage.postedAt = Date.now();

    newMessage.save(callback);
};

exports.destroy = function(callback) {
    announceModel.remove({},callback);
};
