var mongoose = require('mongoose');

var mailSchema = mongoose.Schema({
    body: String,
    from: String,
    to: String,
    subject: String,
    date: {
        type: Date,
        default: Date.now
    },
    mailID: mongoose.Schema.Types.ObjectId
});

var mailModel = exports.messageModel = mongoose.model('Mail', mailSchema);

exports.findInMails = function(to, callback) {
    var mails = [];
    mailModel.find({
        to: to
    }, function(err, obj) {
        mails = mails.concat(obj);
        mails = mails.sort({
            date: 'descending'
        });
        callback(null, mails);
    });
};

exports.findSentMails = function(from, callback) {
    var mails = [];
    mailModel.find({
        from: from
    }, function(err, obj) {
        mails = mails.concat(obj);
        mails = mails.sort({
            date: 'desc'
        });
        callback(null, mails);
    });
};

exports.addMail = function(from, to, subject, body, callback) {
    var newMail = new mailModel();
    newMail.from = from;
    newMail.to = to;
    newMail.subject = subject;
    newMail.body = body;
    newMail.save(callback);
};

exports.deleteMail = function(from, to, subject, body, callback) {
    mailModel.remove({
        'from': from,
        'to': to,
        'subject': subject,
        'body': body
    }, callback);
};

exports.destroy = function(callback) {
    mailModel.remove({}, callback);
};
