// controllers/sectionController.js
const Company = require('../models/companyModel');

// LIST ALL PRODUCTS (Read)
exports.getAllCompany = async (req, res) => {
    try {
        const company = await Company.findAll();
        const rowcount = company.length;
        const section = 'company';
        
        res.render('company/index', { 
            section,
            company, 
            rowcount,
            title: 'Company',
            navs: 'yes',
            search: 'yes',
            breadcrumbs: '/company',
        });
    } catch (error) {
        res.status(500).send('Error loading company: ' + error.message);
    }
};

// SHOW CREATE FORM
exports.showCreateCompany = async(req, res) => {
    try{
        const company = await Company.showCompany(req.params.id);
        const rowcount = company.length;
        const section = req.params.id;
        const createdAt = new Date().toISOString();

        res.render('company/add', {
            section,
            company,
            rowcount,
            title: 'One Company',
            navs:'yes',
            search:'no',
            breadcrumbs: '/company/'+req.params.id,
            mode: 'new',
            arrayDate: createdAt, 
        });
    } catch (error) {
        res.status(500).send('Error laoding company: ' + error.message);
    }
};


// HANDLE CREATE (Create)
exports.createCompany = async (req, res) => {
    try {
        const { mode, companyname, zipcode, symbol  } = req.body;
        await Company.create({ 
            // name, 
            // price: parseFloat(price), 
            // stock: parseInt(stock) || 0, 
            mode,
            companyname,
            zipcode,
            symbol
        });
        res.redirect('/company');
    } catch (error) {
        res.status(500).send('Error creating company: ' + error.message);
    }
};

// SHOW EDIT FORM
exports.showEditForm = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).send('Company not found');
        res.render('company/edit', { 
            company,
            title: "Edit Company",
            navs:"yes",
            search:"no",
            rowcount:"",
            breadcrumbs: "/company", 
        });
    } catch (error) {
        res.status(500).send('Error loading edit company form: ' + error.message);
    }
};

// HANDLE EDIT (Update)
// Note: Standard HTML forms only support GET/POST, so we use POST for submission
exports.updateCompany = async (req, res) => {
    try {
        /*const { name, price, stock } = req.body;
        await Company.update(req.params.id, { 
            name, 
            price: parseFloat(price), 
            stock: parseInt(stock) || 0 
        });
        */
        const { mode, companyname, zipcode, symbol  } = req.body;
        await Company.update(req.params.id, { 
            mode,
            companyname, 
            zipcode, 
            symbol
        });
        //res.redirect('/company');
        res.status(200).send('<script>if (window.opener && !window.opener.closed) { window.opener.location.reload();} window.close();</script>');
    } catch (error) {
        res.status(500).send('Error updating company: ' + error.message);
    }
};

// HANDLE DELETE (Delete)
exports.deleteCompany = async (req, res) => {
    try {
        await Company.delete(req.params.id);
        res.redirect('/company');
    } catch (error) {
        res.status(500).send('Error deleting company: ' + error.message);
    }
};