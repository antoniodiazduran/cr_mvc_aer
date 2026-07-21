// controllers/productController.js
const Product = require('../models/productModel');

// LIST ALL PRODUCTS (Read)
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        const rowcount = products.length;

        res.render('product/index', { 
            products, 
            rowcount,
            title: 'Products',
            navs: 'yes',
            search: 'yes',
        });
    } catch (error) {
        res.status(500).send('Error loading dashboard: ' + error.message);
    }
};

// SHOW CREATE FORM
exports.showCreateForm = (req, res) => {
    res.render('add');
};

// HANDLE CREATE (Create)
exports.createProduct = async (req, res) => {
    try {
        const { name, price, stock } = req.body;
        await Product.create({ 
            name, 
            price: parseFloat(price), 
            stock: parseInt(stock) || 0 
        });
        res.redirect('/products');
    } catch (error) {
        res.status(500).send('Error creating product: ' + error.message);
    }
};

// SHOW EDIT FORM
exports.showEditForm = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        res.render('edit', { 
            product 
        });
    } catch (error) {
        res.status(500).send('Error loading edit form: ' + error.message);
    }
};

// HANDLE EDIT (Update)
// Note: Standard HTML forms only support GET/POST, so we use POST for submission
exports.updateProduct = async (req, res) => {
    try {
        const { name, price, stock } = req.body;
        await Product.update(req.params.id, { 
            name, 
            price: parseFloat(price), 
            stock: parseInt(stock) || 0 
        });
        res.redirect('/products');
    } catch (error) {
        res.status(500).send('Error updating product: ' + error.message);
    }
};

// HANDLE DELETE (Delete)
exports.deleteProduct = async (req, res) => {
    try {
        await Product.delete(req.params.id);
        res.redirect('/products');
    } catch (error) {
        res.status(500).send('Error deleting product: ' + error.message);
    }
};