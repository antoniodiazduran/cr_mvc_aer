const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');

// View Routes
router.get('/sections', sectionController.getAllSections);
router.get('/sections/:id', sectionController.getOnlySections);
router.get('/sections/add/:id', sectionController.showCreateSection);
router.get('/sections/edit/:sec/:id', sectionController.showEditForm);
router.get('/sections/array/:sec/:id/:a_name', sectionController.showEditArrayForm);

//
// Action Routes
router.post('/sections/add/:id', sectionController.createSections);
router.post('/sections/upd/:sec/:id', sectionController.updateSection);
router.post('/sections/array/save/:sec/:id', sectionController.saveArrayForm);
router.get('/sections/delete/:id', sectionController.deleteSection);


module.exports = router;