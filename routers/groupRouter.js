/**
 * Created by sxh on 16/11/11.
 */

var express = require('express');
var router = express.Router();
var groupCtrl = require('../controllers/groupCtrl.js');
var jsonParser = require('body-parser').json();


router.get('/needers', jsonParser, groupCtrl.findNeeders);
router.get('/offers', jsonParser, groupCtrl.findProviders);
router.get('/messages', jsonParser, groupCtrl.findMessages);
router.get('/noidentities', jsonParser, groupCtrl.findnoidentities);
//router.post('/', jsonParser, announceCtrl.postAnnouncement);



module.exports = router;