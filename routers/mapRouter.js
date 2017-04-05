var express = require('express');
var router = express.Router();
//var PrivateChatCtrl = require('../controllers/PrivateChatCtrl.js');
var MapDataCtrl = require('../controllers/MapDataController.js');
var jsonParser = require('body-parser').json();

router.get('/markers', MapDataCtrl.getMarkerInfo);
router.post('/markers', MapDataCtrl.setMarkerInfo);
router.delete('/markers', MapDataCtrl.removeMarkerInfo);

module.exports = router;
