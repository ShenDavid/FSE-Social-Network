/**
 * Created by sxh on 16/11/14.
 */

var express = require('express');
var router = express.Router();
var groupCtrl = require('../controllers/groupCtrl.js');
var jsonParser = require('body-parser').json();

router.get('/', groupCtrl.findGroups);



module.exports = router;