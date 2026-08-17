// models/sectionModel.js
const { ObjectId } = require('mongodb');
const connectDB = require('../config/db');
//const sendTextMessage = require('../config/sms');
//const sendEmailMessage = require('../config/email');

async function getCollection() {
    const db = await connectDB();
    return db.collection('aer');
}

const Section = {

    // Add Sections
    async addSection(form) {
    
    // Gathering the information from form object
    const body = form.body;

    // logger to journalctl
    console.log(JSON.stringify(body));

    // 1. Clone the form data from req.body
    const docToInsert = { ...body };
        Object.keys(body).forEach((key)=>{
            if (key.substring(0,6)=='array_'){
                // 2. Convert the "notes" string into a real, queryable JSON array
                if (docToInsert[key]) {
                    
                    let cleanString = docToInsert[key].replace(/"/g, "").replace(/'/g, "").replace(/ /g,"").replace(/[\[\]]/g,"");
                    let configs = cleanString.replace(/[{}]/g,"").replace(/[\[\]]/g,"");
                  

                    let config_a = configs.split(",");
                    let firstdoc = "";
                    config_a.forEach((row)=>{
                        const [k, v] = row.split(":");
                        if (v=='date') { val = Date.now();  }
                        else if (v=='text') { val = 'Document_created'; }
                        else if (v=='number') { val = '0'; }
                        else { val="..."; }
                        firstdoc = firstdoc + k + ":" + val + ",";
                    });  
                    firstdoc = firstdoc.slice(0,-1);
                    firstdoc = "{" + firstdoc + "}";
                    firstdoc = firstdoc.replace("{",'{"').replace("}",'"}').replaceAll(":",'":"').replaceAll(",",'","');
                    let newString = cleanString.replace("{",'{"').replace("}",'"}').replaceAll(":",'":"').replaceAll(",",'","');
                    let finalString = "[" + newString + "," + firstdoc + "]";
                    docToInsert[key] = JSON.parse(finalString);
                }
            }
        });

        // Extracting the file name from req.files variable
        let fileVar = "";
        let docsVar = "";
        
        if(form.files) {
            //  Gathering the field name from files object
            Object.keys(form.files).forEach((filex)=>{ fileVar = fileVar + filex;});    

            // Gathering document name from files object
            Object.values(form.files).forEach((docx)=>{
                docsVar = docsVar + docx.name;
            });
            // adding the file info to the record
            docToInsert[fileVar] = JSON.parse('[{"tdate":"'+Date.now()+'","filename":"file_'+crypto.randomUUID()+'","realname":"'+docsVar+'"}]');
        }

        // Define where to save the file
        /*
        const uploadPath = path.join(__dirname, 'uploads', uploadedFile.name);

        // Save the file asynchronously
        form.files.mv(uploadPath, (err) => {
            if (err) {
                return res.status(500).send(err);
            }

            res.send(`File uploaded successfully to: ${uploadPath}`);
        });
        */

        // Saving data to mongodb
        const collection = await getCollection();
        const result = await collection.insertOne(docToInsert);
        return { _id: result.insertedId }; 
    },
    // save Array form
    async saveArrayForm(form) {
        const logid = new ObjectId(form._id);
        
        let dataArray = '{"$push":{"'+form.field+'":a_v}}';
        let array_val = "{";
        Object.entries(form).forEach(([k,v])=>{
            if (k.includes('f_')) {
                key = k.replace('f_','');
                array_val = array_val + '"'+ key + '"' + ':"' + v + '",';
            } 
            if (k.includes('d_')) {
                key = k.replace('d_','');
                array_val = array_val + '"'+ key + '"' + ':"' + Date.now() + '",';
            }
        });

        array_val = array_val.slice(0,-1);
        array_val = array_val + "}";
        dataArray = dataArray.replace("a_v",array_val);
        let updData = JSON.parse(dataArray);

        // Saving data into database
        const collection = await getCollection();
        const result = await collection.updateOne({_id:logid},updData);
        // finding onwers phonenumber
        const owner = await collection.find({_id:logid}).toArray();
        //console.log(owner[0]['requestor']);

        // Communicating changes to owner
        //const sms = await sendTextMessage(owner[0]['requestor'],'+18333507932',"Record updated http://35.209.35.43:3030/sections/edit/"+form.section+"/"+form._id);
        //const email = await sendEmailMessage('antonio.diaz@revgroup.com,kevin.kraus@revgroup.com','note1','test1');
        
        // Sending results to page
        return { _id: result.modifiedCount }; 
        
    },
    // Show form
    async showAddSection(id) {
        const collection = await getCollection();
        //return await collection.find({mode:'config',schema:id}).sort({fieldOrder:1}).toArray();
        return await collection.find({mode:'config',schema:id}).sort({fieldOrder:1}).toArray();
    },
    async showfindDropDown(query){
        const collection = await getCollection();
        const queryJson = JSON.parse(query);
        
        return await collection.find(queryJson).toArray();
    },
    // Show List 
    async showSection(id) {
        const collection = await getCollection();
        return await collection.find({mode:'data',section:id}).sort({datetime:-1}).toArray();
    },
    // Show section headers
    async showHeaders(id) {
        const collection = await getCollection();
        return await collection.find({mode:'config',schema:id,columnVisible:'yes'}).sort({fieldOrder:1}).toArray();
    },
    // Show arrays from section
    async showArrays(id) {
        const collection = await getCollection();
        return await collection.find({mode:'config',htmltype:'array',schema:id},{idName:1});
    },
    // List all data
    async findAll() {
        const collection = await getCollection();
        //return await collection.find({mode:'config',schema:true}).sort({fieldOrder:1}).toArray();
        //return await collection.aggregate([{$match:{mode:"config"}},{$group:{_id:"$schema",total:{$sum:1}}}]).sort({_id:1}).toArray();
        return await collection.aggregate([{$group:{_id:"$schema",totalschema:{$count:{}}}}]).sort({_id:1}).toArray();
    },

    // Find a single document by ID
    async findByRow(id) {
        const collection = await getCollection();
        //return await collection.aggregate([{ $match:{_id: new ObjectId(id)}} , {$unwind:"$array_notes"}]).toArray();
        return await collection.find({ _id: new ObjectId(id) }).toArray();
    },

    // Find a single item by ID
    async findById(id) {
        const collection = await getCollection();
        return await collection.findOne({ _id: new ObjectId(id) });
    },

    // Edit data
    async update(id, updateData) {

        // Declaring constants to update data
        const updFile = updateData.files;
        const logid = new ObjectId(id);
        const updBody = updateData.body;
        const collection = await getCollection(); 
         
        // Updatng the body section of the document
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updBody }
        );
        // Extracting the file name from req.files variable
        let fileVar = "";
        let docsVar = "";
        if(updFile) {
            Object.keys(updFile).forEach((filex)=>{ fileVar = fileVar + filex;});
            Object.values(updFile).forEach((docx)=>{
                docsVar = docsVar + docx.name;
            });
            // adding the file info to the record
            const updString = '{"$push":{"'+fileVar+'":{"tdate":"'+Date.now()+'","filename":"file_'+crypto.randomUUID()+'","realname":"'+docsVar+'"}}}';
            let updJson = JSON.parse(updString);
            const result = await collection.updateOne({_id:logid},updJson);

            /* Define where to save the file
            const uploadPath = path.join(__dirname, 'uploads', uploadedFile.name);
            // "sampleFile" matches the 'name' attribute in the HTML input field
            const uploadedFile = req.files.sampleFile;  
            // Save the file asynchronously
            uploadedFile.mv(uploadPath, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.send(`File uploaded successfully to: ${uploadPath}`);
            });
            */

            return result; // Returns info like matchedCount and modifiedCount
        } else {
            return result;  // Return the updated req.form section
        }
    },

    // Delete data
    async delete(id) {
        const collection = await getCollection();
        return await collection.deleteOne({ _id: new ObjectId(id) });
    }
};


module.exports = Section;