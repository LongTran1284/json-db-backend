const router = require('express').Router();

const { authentication, restrictTo } = require('../controllers/auth.controller');
const control = require('../controllers/order.controller');

router.route('/')
.get(authentication, restrictTo('admin', 'user'), control.getAllProducts)
.post(authentication, control.addProduct)

router.route('/:id')
.get(authentication, control.getProduct)
.put(authentication, control.updateProduct)
.delete(authentication, control.deleteProduct)



module.exports = router;