var express = require('express');
var router = express.Router();
var announceCtrl = require('../controllers/announceCtrl.js');
var jsonParser = require('body-parser').json();

router.get('/', announceCtrl.findLimitedAnnouncements);
router.post('/', jsonParser, announceCtrl.postAnnouncement);



module.exports = router;
