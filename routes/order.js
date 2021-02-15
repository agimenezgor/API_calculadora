var express = require('express');
var router = express.Router();
const OrderController = require('../controllers/orderController');

router.get('/:number/:palets', OrderController.getOrder);

module.exports = router;