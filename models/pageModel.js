// models/sectionModel.js
const { ObjectId } = require('mongodb');
const connectDB = require('../config/db');
//const sendTextMessage = require('../config/sms');
//const sendEmailMessage = require('../config/email');

async function getCollection() {
    const db = await connectDB();
    return db.collection('phrases');
}

const Page = {

    // Add contact
    async addContact(form) {
        // Gathering the information from form object
        const body = form.body;

         // Saving data to mongodb
        const collection = await getCollection();
        const result = await collection.insertOne(body);
        return { _id: result.insertedId }; 
    },

    // Add Phrase
    async addPhrase(form) {
        // Gathering the information from form object
        const body = form.body;

         // Saving data to mongodb
        const collection = await getCollection();
        const result = await collection.insertOne(body);
        return { _id: result.insertedId }; 
    },
    
    // List all data
    async findAll() {
        const collection = await getCollection();
        return await collection.find().toArray();
    },

    // Find a single document randomlly
    async findOnePhrase() {
        const collection = await getCollection();
        return await collection.aggregate([{ $sample: { size: 1 } }]).toArray();
    },
    // Find a single document randomlly
    async findByRow(id) {
        const idx = id*1;
        const collection = await getCollection();
        return await collection.find({ RecordID:idx }).toArray();
    },


};


module.exports = Page;