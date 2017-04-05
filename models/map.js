var mongoose = require('mongoose');

var markerSchema = mongoose.Schema({
    lat: Number,
    lng: Number,
    title: String,
    message: String,
    markerID: mongoose.Schema.Types.ObjectId
});

var mapMarkerModel = exports.mapMarkerModel = mongoose.model('mapMarker', markerSchema);

exports.getMarkerInfo = function(callback) {
    mapMarkerModel.find({}).exec(function (err, docs) {
        callback(err, docs);
    });
};

//create
exports.addMarkerInfo = function(lat, lng, title, message, callback) {
    if (lat == null || lng == null) {
      return callback("Invalid input", null);
    }

    var newMarker = new mapMarkerModel();
    newMarker.lat = lat;
    newMarker.lng = lng;
    newMarker.title = title;
    newMarker.message = message;

    newMarker.save(callback);

};

exports.removeMarkerInfo = function(id, callback) {
    console.log("id = " + id);
    mapMarkerModel.remove({title: id}, function(err,removed) {
        console.log("removed count = " + removed);
        callback(err, removed);
    });
};

exports.destroy = function(callback) {
    mapMarkerModel.remove({}, callback);
};
