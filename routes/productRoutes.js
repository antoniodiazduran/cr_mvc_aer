const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// View Routes
router.get('/products', productController.getAllProducts);
router.get('/products/add', productController.showCreateForm);
router.get('/products/edit/:id', productController.showEditForm);

// Action Routes
router.post('/products/add', productController.createProduct);
router.post('/products/edit/:id', productController.updateProduct);
router.post('/products/delete/:id', productController.deleteProduct);

module.exports = router;