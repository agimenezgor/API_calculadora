var express = require('express');
var router = express.Router();
const SupplierController = require('../controllers/SupplierControllers');

router.get('/:number', SupplierController.getSupplier);
router.get('/', SupplierController.getAll);
router.post('/', SupplierController.register);
router.put('/:number', SupplierController.update);
//router.delete('/:number', SupplierController.delete);

module.exports = router;