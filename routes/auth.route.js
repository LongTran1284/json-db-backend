const router = require('express').Router();
const control = require('../controllers/auth.controller')


router.route('/').get(control.getAllUsers);
router.route('/create-new-user').post(control.createUser);
router.route('/login').post(control.login);

module.exports = router;