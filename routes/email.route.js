const router = require('express').Router();
const sendEmail = require('../controllers/send-email')


router.route('/').post(sendEmail);

module.exports = router;