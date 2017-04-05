var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
      name: {type: String, default: ""},
      address: {type: String, default:""},
      phoneNumber: {type: String, default:""},
      imageUrl: {type: String, default: "/src/assets/github.png"},
      familyMembers: [String]
    },
    salt: {
        type: String,
        required: true
    },
    active: {
      type: Boolean,
      default : true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    lastLoginAt: {
        type: Date,
        default: Date.now
    },
    lastStatusCode: {
        type: String,
        default: "N/A"
    },
    privilage: {
      type: String,
      default : "Citizen",
      required : true
    },

    accountStatus: String
}, {
    strict: true
});

var userModel = exports.userModel = mongoose.model('User', userSchema);

exports.findUserProfileByName = function(name, callback) {
  userModel.findOne({
      username: name
  }, function(err, user) {
      if (err) {
          callback(err, null);
      } else {
          console.log(user);
          callback(null, user.profile);
      }
  });
};

exports.editProfile = function(username, profile, filename, callback) {
  exports.findUserByName(username, function(err, user) {
      if (err)
          callback(err);
      else {
          user.profile.name = profile.name;
          user.profile.address = profile.address;
          user.profile.phoneNumber = profile.phoneNumber;
          user.profile.imageUrl = filename;
          user.profile.familyMembers = profile.familyMembers;
          user.save(callback);
      }
  });
}


exports.findUserByName = function(name, callback) {
    userModel.findOne({
        username: name
    }, callback);
};

exports.findUsers = function(callback) {
    var s = [];
    exports.findOnlineUsers(function(err, users) {
        if (err) {
            callback(err, null);
        } else {
            s = s.concat(users);
        }
    });

    exports.findOfflineUsers(function(err, users) {
        if (err) {
            callback(err, null);
        } else {
            s = s.concat(users);
            callback(null, s);
        }
    });
};

exports.findOnlineByStatus = function(status, callback) {
    userModel.find({
        lastStatusCode: status,
        accountStatus: "Online"
    }).sort({
        username: 'asc'
    }).exec(callback);
};

exports.findOfflineByStatus = function(status, callback) {
    userModel.find({
        lastStatusCode: status,
        accountStatus: "Offline"
    }).sort({
        username: 'asc'
    }).exec(callback);
};

exports.findUsersByStatus = function(status, callback) {
    var s = [];
    exports.findOnlineByStatus(status, function(err, users) {
        if (err) {
            callback(err, null);
        } else {
            s = s.concat(users);
        }
    });
    exports.findOfflineByStatus(status, function(err, users) {
        if (err) {
            callback(err, null);
        } else {
            s = s.concat(users);
            callback(null, s);
        }
    });
};

exports.findOnlineByName = function(name, callback) {
    userModel.find({
        username: new RegExp(".*" + name + ".*", "i"),
        accountStatus: "Online"
    }).sort({
        username: 'asc'
    }).exec(callback);
};

exports.findOfflineByName = function(name, callback) {
    userModel.find({
        username: new RegExp(".*" + name + ".*", "i"),
        accountStatus: "Offline"
    }).sort({
        username: 'asc'
    }).exec(callback);
};

exports.findUsersByRegexName = function(name, callback) {
    var s = [];
    exports.findOnlineByName(name, function(err, users) {
        if (err) {
            callback(err, null);
        } else {
            s = s.concat(users);
        }
    });
    exports.findOfflineByName(name, function(err, users) {
        if (err) {
            callback(err, null);
        } else {
            s = s.concat(users);
            callback(null, s);
        }
    });
};


exports.findOnlineUsers = function(callback) {
    userModel.find({
        accountStatus: "Online"
    }).sort({
        username: 'asc'
    }).exec(callback);
};

exports.findOfflineUsers = function(callback) {
    userModel.find({
        accountStatus: "Offline"
    }).sort({
        username: 'asc'
    }).exec(callback);
};

//create
exports.addUser = function(name, pwd, salt, callback) {
    var newUser = new userModel();
    newUser.username = name;
    newUser.password = pwd;
    newUser.salt = salt;
    newUser.accountStatus = "Online";
    newUser.active = true;
    newUser.save(callback);
};

//update
exports.editLoginTime = function(name, callback) {
    exports.findUserByName(name, function(err, doc) {
        if (err)
            callback(err);
        else {
            var date = Date.now();
            doc.updatedAt = date;
            doc.lastLoginAt = date;
            doc.save(callback);
        }
    });
};

exports.editStatusCode = function(status, name, callback) {
    exports.findUserByName(name, function(err, doc) {
        if (err)
            callback(err);
        else {
            var date = Date.now();
            doc.updatedAt = date;
            doc.lastStatusCode = status;
            doc.save(callback);
        }
    });
};

exports.editAccountStatus = function(name, status, callback) {
    exports.findUserByName(name, function(err, doc) {
        if (err)
            callback(err);
        else {
            var date = Date.now();
            doc.updatedAt = date;
            doc.accountStatus = status;
            doc.save(callback);
        }
    });
};

exports.editPrivilage = function (name, privilage, callback ) {
  exports.findUserByName(name, function(err, doc) {
          doc.privilage = privilage;
          doc.save(callback);
  });
};

exports.editUsername = function (oldname, newname, callback ) {
  exports.findUserByName(oldname, function(err, doc) {
          doc.username = newname;
          doc.save(callback);
  });
};

exports.editActive = function (name, activestatus, callback){
  exports.findUserByName(name, function(err, doc) {
          doc.active = activestatus;
          doc.save(callback);
  });
};

exports.setPassword = function (name, password, salt, callback ) {
  exports.findUserByName(name, function(err, doc) {
    doc.password = password;
    doc.salt = salt;
    doc.save(callback);
  });
};



exports.init = function (callback) {
  // instatiate default administrator
  exports.findUserByName("ESNAdmin", function(err, doc) {
    if (!doc) {
      console.log("Adding ESNAdmin to database")
      var newUser = new userModel();
      newUser.username = "ESNAdmin";
      newUser.password = '85a47c7b68cc16bc0adf81bd089bcef1f5fa5c3aff171772fb47c74b856bf29bb6a527ba65a7689e33a3a66552eed3874799267ef18a353b97b654f101de648c';
      newUser.salt = '60a0691666beb5b0';
      newUser.accountStatus = "Offline";
      newUser.privilage = "Administrator" ;
      newUser.lastStatusCode = "OK";
      newUser.save(callback);
    }
    else {
      console.log("ESNAdmin already in database")
    }
  });
};

exports.destroy = function(callback) {
    userModel.remove({}, callback);
};
