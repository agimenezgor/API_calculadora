var express = require('express');
var router = express.Router();
const ReferenceController = require('../controllers/ReferenceControllers');

//router.get('/:number', ReferenceController.getReference);
router.get('/:number', ReferenceController.getAll);
router.post('/:number', ReferenceController.register);
//router.put('/:number', ReferenceController.update);
//router.delete('/:number', ReferenceController.delete);

module.exports = router;