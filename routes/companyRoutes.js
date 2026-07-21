const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

// View Routes
router.get('/company', companyController.getAllCompany);
router.get('/company/add', companyController.showCreateCompany);
router.get('/company/edit/:id', companyController.showEditForm);
//
//
// Action Routes
router.post('/company/add', companyController.createCompany);
router.post('/company/edit/:id', companyController.updateCompany);
router.get('/company/delete/:id', companyController.deleteCompany);


module.exports = router;