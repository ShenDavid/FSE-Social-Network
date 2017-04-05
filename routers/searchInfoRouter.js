var express = require('express');
var router = express.Router();
var SearchInformationCtrl = require('../controllers/SearchInformationCtrl.js');
var jsonParser = require('body-parser').json();

router.post('/status', SearchInformationCtrl.findUsersByStatus);
router.post('/name', SearchInformationCtrl.findUsersByName);
router.post('/announcements', SearchInformationCtrl.findAnnouncements);
router.post('/public', SearchInformationCtrl.findPublicMessages);
router.post('/private', SearchInformationCtrl.findPrivateMessages);

module.exports = router;
