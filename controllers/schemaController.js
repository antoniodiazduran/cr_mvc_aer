// controllers/schemaController.js
const Schema = require('../models/schemaModel');


exports.getAllSchemas = async (req, res) => {
    try {
        const schemas = await Schema.findAll();
        const rowcount = schemas.length;
        const section = "schemas";

        res.render('schemas/index', { 
            section,
            schemas, 
            rowcount,
            title: 'Schemas',
            navs: 'yes',
            search: 'yes',
            breadcrumbs: '/schemas',
        });
    } catch (error) {
        res.status(500).send('Error loading schema: ' + error.message);
    }
};

// SHOW CREATE FORM
exports.showCreateForm = (req, res) => {
    res.render('schemas/add', { 
        title: "Add Schemas",
        navs:"yes",
        search:"no",
        rowcount:"",
        breadcrumbs: "/schemas",
    });
};

// HANDLE CREATE (Create)
exports.createSchema = async (req, res) => {
    try {
        const { schema, htmltype, sql, lablel, fieldName, idName, fieldLength, required, initialValue, className, styleScript, fieldEvent,  functionName, placeholder, joinTable, fieldOrder, fieldVisible, columnVisible  } = req.body;
        await Schema.create({ 
            // name, 
            // price: parseFloat(price), 
            // stock: parseInt(stock) || 0, 
            mode:"config",
            schema, 
            htmltype, 
            sql, 
            lablel, 
            fieldName, 
            idName, 
            fieldLength, 
            required, 
            initialValue, 
            className, 
            styleScript, 
            fieldEvent,  
            functionName, 
            placeholder, 
            joinTable, 
            fieldOrder, 
            fieldVisible, 
            columnVisible
        });
        res.redirect('/schemas');
    } catch (error) {
        res.status(500).send('Error creating schema: ' + error.message);
    }
};

// SHOW EDIT FORM
exports.showEditForm = async (req, res) => {
    try {
        const schema = await Schema.findById(req.params.id);
        if (!schema) return res.status(404).send('Schema not found');
        res.render('schemas/edit', { 
            schema,
            title: "Edit Schemas",
            navs:"yes",
            search:"no",
            rowcount:"",
            breadcrumbs: "/schemas", 
        });
    } catch (error) {
        res.status(500).send('Error loading edit form: ' + error.message);
    }
};

// HANDLE EDIT (Update)
// Note: Standard HTML forms only support GET/POST, so we use POST for submission
exports.updateSchema = async (req, res) => {
    try {
        /*const { name, price, stock } = req.body;
        await Schema.update(req.params.id, { 
            name, 
            price: parseFloat(price), 
            stock: parseInt(stock) || 0 
        });
        */
        const { schema, htmltype, sql, lablel, fieldName, idName, fieldLength, required, initialValue, className, styleScript, fieldEvent,  functionName, placeholder, joinTable, fieldOrder, fieldVisible, columnVisible  } = req.body;
        await Schema.update(req.params.id, { 
            mode:"config",
            schema, 
            htmltype, 
            sql, 
            lablel, 
            fieldName, 
            idName, 
            fieldLength, 
            required, 
            initialValue, 
            className, 
            styleScript, 
            fieldEvent,  
            functionName, 
            placeholder, 
            joinTable, 
            fieldOrder: parseInt(fieldOrder) || 0, 
            fieldVisible, 
            columnVisible
        });
        //res.redirect('/schemas');
        res.status(200).send('<script>if (window.opener && !window.opener.closed) { window.opener.location.reload();} window.close();</script>');
    } catch (error) {
        res.status(500).send('Error updating schema: ' + error.message);
    }
};

// HANDLE DELETE (Delete)
exports.deleteSchema = async (req, res) => {
    try {
        await Schema.delete(req.params.id);
        res.redirect('/schemas');
    } catch (error) {
        res.status(500).send('Error deleting schema: ' + error.message);
    }
};