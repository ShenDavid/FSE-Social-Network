var announce = require('../models/announce');

module.exports = {
    findAnnouncements: function(req, res) {
        announce.findAnnouncements(function(err, docs) {
            if (err) {
                console.log(err);
            } else {
                res.status(200).json(docs);
            }

        });
    },
    findLimitedAnnouncements: function(req, res) {
        announce.findLimitedAnnouncements(function(err, docs) {
            if (err) {
                console.log(err);
            } else {
                res.status(200).json(docs);
            }

        });
    },
    postAnnouncement: function(req, res) {
        announce.addAnnouncement(req.body.content,
            req.body.author,
            function(err, msg) {
                if (err) {
                    // TO DO : Error to client
                    console.log(err);
                    res.status(500).send('Something broke!');
                    //socket(socket.id).emit('Error Saving Message');
                } else {
                    console.log(msg);
                    res.status(200).json(msg);
                }
        });

    }
};
