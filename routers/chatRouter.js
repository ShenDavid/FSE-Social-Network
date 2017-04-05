var express = require('express');
var router = express.Router();
var PrivateChatCtrl = require('../controllers/PrivateChatCtrl.js');
var PublicChatCtrl = require('../controllers/PublicChatCtrl.js');
var jsonParser = require('body-parser').json();

router.get('/public', PublicChatCtrl.findPublicMessages);

router.get('/private', PrivateChatCtrl.findPrivateMessages);
router.get('/private/unread', PrivateChatCtrl.unreadMessages);

router.post('/public', PublicChatCtrl.postPublicMessages);
router.post('/private', PrivateChatCtrl.postPrivateMessages);


module.exports = router;
