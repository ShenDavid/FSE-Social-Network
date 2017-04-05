var express = require('express');
var router = express.Router();
var mailCtrl = require('../controllers/MailCtrl.js');
var jsonParser = require('body-parser').json();


router.post('/inmails', mailCtrl.findInMails);
router.post('/sentmails', mailCtrl.findSentMails);

router.post('/', mailCtrl.addMail);
router.post('/delete', mailCtrl.deleteMail);

module.exports = router;
