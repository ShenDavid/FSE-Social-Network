var path = require('path');

var rootPath = path.normalize(__dirname);

module.exports = {
    root: rootPath,
    port: process.env.PORT || 5001,
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/fse-esn',
    testMongoUrl: 'mongodb://localhost/fse-esn-test',
};
