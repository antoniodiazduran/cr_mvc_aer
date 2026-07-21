const express = require('express');
const router = express.Router();
const schemaController = require('../controllers/schemaController');

// View Routes
router.get('/schemas', schemaController.getAllSchemas);
router.get('/schemas/add', schemaController.showCreateForm);
router.get('/schemas/edit/:id', schemaController.showEditForm);
//
//
// Action Routes
router.post('/schemas/add', schemaController.createSchema);
router.post('/schemas/edit/:id', schemaController.updateSchema);
router.get('/schemas/delete/:id', schemaController.deleteSchema);


module.exports = router;