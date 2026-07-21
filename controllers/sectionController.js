// controllers/sectionController.js
const Section = require('../models/sectionModel');
const Schema = require('../models/schemaModel');

// ADD DATA TO DATABASE FROM FORM
exports.createSections = async(req, res) => {
    try{
        const result = await Section.addSection(req);
        //res.send(result);
        res.redirect('/sections/'+req.body.section);
    } catch (error) {
        res.status(500).send('Error adding sections to mongodb' + error.message);
    }
};

// LIST ALL PRODUCTS (Read)
exports.getAllSections = async (req, res) => {
    try {
        const sections = await Section.findAll();
        const rowcount = sections.length;
        const section = 'All sections';
        
        res.render('sections/index', { 
            section,
            sections, 
            rowcount,
            title: 'Sections',
            navs: 'yes',
            search: 'yes',
            breadcrumbs: '/sections',
        });
    } catch (error) {
        res.status(500).send('Error loading sections: ' + error.message);
    }
};

// GET ONE SECTION
exports.getOnlySections = async (req, res) => {
    try {
        //const headers = await Section.showHeaders(req.params.id);
        //const sections = await Section.showSection(req.params.id);

        // Faster with Promises.all
        const [headers, sections, arrays] = await Promise.all([ Section.showHeaders(req.params.id), Section.showSection(req.params.id), Section.showArrays(req.params.id) ]);

        let nArrays = [];
        await arrays.forEach(doc=>{
            nArrays.push(doc.idName+","+doc.placeholder);
        })

        const rowcount = sections.length;
        const section = req.params.id;

        const columns = [];
        await headers.forEach(title => { 
            if (title.htmltype=='array'){
                columns.push('array_'+title.idName)
            } else {
                columns.push(title.idName)
            }
        });

        res.render('sections/list', { 
            section,
            sections, 
            columns,
            headers,
            nArrays,
            rowcount,
            title: 'Sections',
            navs: 'yes',
            search: 'yes',
            breadcrumbs: '/sections',
        });
    } catch (error) {
        res.status(500).send('Error loading only sections: ' + error.message);
    }
};

// SHOW CREATE FORM
exports.showCreateSection = async(req, res) => {
    try{
        const sections = await Section.showAddSection(req.params.id);
        const rowcount = sections.length;
        const section = req.params.id;
        const createdAt = new Date().toISOString();

        // *************************************************************************************************************
        // For "dropdown" type to extract initial Value
        // **initialValue must have the collection section field with somthing
        // and the placeholder field with the value for the select option and the diplay option like nicknam:phonenumber 
        // separated with a colon
        // For "array" type the initiaValue must contain the fields for the array enclosed like an JSON array
        // [ { field: type, field: type, field:type ... } ]
        // type "date" will be saved as Epoch number and converted to ISO string Date when displayed on page
        // **************************************************************************************************************

        let dropdownQuery = [];
        let dropdownValue = [];
        const dropdowns = [];

        // Analyzing dropdown type to extract initial Value
        sections.some((docs)=>{
            if(docs.htmltype==='dropdown'){
                dropdownQuery[docs.idName] = docs.initialValue; 
                dropdownValue[docs.idName] = docs.placeholder;
                return false;
            }    
        });


        // 1. Map entries to an array of pending promises
        const promises = Object.entries(dropdownQuery).map(async ([key, val]) => {
            try {
            // Await the database operation directly
            const result = await Section.showfindDropDown(val);
            dropdowns[key] = result; // Store the resolved value
            } catch (error) {
            console.log("Error querying the database finddropdown: " + error);
            dropdowns[key] = null; // Fallback or handle error gracefully
            }
        });
        // 2. Wait for EVERY database query to resolve completely
        await Promise.all(promises);

        // Sending data to page
        res.render('sections/add', {
            section,
            sections,
            rowcount,
            dropdowns,
            dropdownValue,
            title: 'Section',
            navs:'yes',
            search:'no',
            breadcrumbs: '/sections/add/'+req.params.id,
            mode: 'new',
            arrayDate: createdAt, 
        });
        
    } catch (error) {
        res.status(500).send('Error laoding show sections: ' + error.message);
    }
    
};


exports.saveArrayForm = async (req, res) => {
    try {
        const formdata = req.body;
        const result = await Section.saveArrayForm(formdata);
    
        res.redirect('/sections/array/'+req.body.section+"/"+req.body._id+"/"+req.body.field);
    } catch (error) {
        res.status(500).send('Error laoding array form: ' + error.message);
    }   
};

// SHOW ARRAY FORM
exports.showEditArrayForm = async (req, res) => {
    try {
        //const sections = await Section.findByRow(req.params.id);
        //const schemas = await Schema.findByArray(req.params.sec);

        // Faster with Promises.all
        const [sections, schemas] = await Promise.all([ Section.findByRow(req.params.id), Schema.findByArray(req.params.sec)  ]);

        if (!sections) return res.status(404).send('Section not found');

        //const notes = sections[0]['array_notes'];

        res.render('sections/array', {
            _id: req.params.id, 
            section: req.params.sec,
            arrayname: req.params.a_name,
            schemas,
            sections,
            title: "Edit ",
            navs:"yes",
            search:"no",
            rowcount:sections?1:"",
            mode:'edit',
            breadcrumbs: "/sections/array/save/"+req.params.sec+"/"+req.params.id, 
        });
    } catch (error) {
        res.status(500).send('Error loading edit array sections form: ' + error.message);
    }
};

// SHOW EDIT FORM
exports.showEditForm = async (req, res) => {
    try {
        //const sections = await Section.findById(req.params.id);
        //const schemas = await Schema.findBySchema(req.params.sec);

        // Faster with Promises.all
        const [sections, schemas] = await Promise.all([ Section.findById(req.params.id), Schema.findBySchema(req.params.sec)  ]);

        if (!sections) return res.status(404).send('Section not found');

        // Analyzing dropdown type to extract initial Value
        let dropdownQuery = [];
        let dropdownValue = [];
        const dropdowns = [];

        // Gathering data from dropdown fields
        schemas.some((docs)=>{
            if(docs.htmltype==='dropdown'){
                dropdownQuery[docs.idName] = docs.initialValue; 
                dropdownValue[docs.idName] = docs.placeholder;
                return false;
            }    
        });

        // 1. Map entries to an array of pending promises
        const promises = Object.entries(dropdownQuery).map(async ([key, val]) => {
            try {
                // Await the database operation directly
                const result = await Section.showfindDropDown(val);
                dropdowns[key] = result; // Store the resolved value
            } catch (error) {
                console.log("Error querying the database findDropdown: " + error);
                dropdowns[key] = null; // Fallback or handle error gracefully
            }
        });
        // 2. Wait for EVERY database query to resolve completely
        await Promise.all(promises);

        res.render('sections/edit', { 
            section: req.params.sec,
            schemas,
            sections,
            dropdowns,
            dropdownValue,
            title: "Edit ",
            navs:"yes",
            search:"no",
            rowcount:sections?1:"",
            mode:'edit',
            breadcrumbs: "/sections/upd/"+req.params.sec+"/"+req.params.id, 
        });
    } catch (error) {
        res.status(500).send('Error loading edit sections form: ' + error.message);
    }
};

// HANDLE EDIT (Update)
// Note: Standard HTML forms only support GET/POST, so we use POST for submission
exports.updateSection = async (req, res) => {
    try {
        const updt = req;
        await Section.update(req.params.id, updt);
        //res.redirect('/sections');
        res.status(200).send('<script>if (window.opener && !window.opener.closed) { window.opener.location.reload();} window.close();</script>');
    } catch (error) {
        res.status(500).send('Error updating section: ' + error.message);
    }
};

// HANDLE DELETE (Delete)
exports.deleteSection = async (req, res) => {
    try {
        await Section.delete(req.params.id);
        res.redirect('/sections');
    } catch (error) {
        res.status(500).send('Error deleting section: ' + error.message);
    }
};