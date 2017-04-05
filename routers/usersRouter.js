var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/userCtrl.js');
var userProfileCtrl = require('../controllers/userProfileCtrl.js');
var jsonParser = require('body-parser').json();
var multer = require('multer');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        req.body.filename = file.fieldname + '-' + Date.now() + '.' + file.originalname;
        cb(null, req.body.filename);
    }
});
var upload = multer({storage: storage});


router.get('/', userCtrl.findUsers);
router.post('/', jsonParser, userCtrl.login);
router.post('/signup', jsonParser, userCtrl.signup);
router.post('/profile', jsonParser, upload.any(), userProfileCtrl.uploadProfile);
router.get('/profile/:username', userProfileCtrl.getProfile);
router.post('/profile/username', userProfileCtrl.setUsername);
router.post('/profile/privilage', userProfileCtrl.setPrivilage);
router.post('/profile/password', userCtrl.setPassword);


module.exports = router;
