// models/companyModel.js
const { ObjectId } = require('mongodb');
const connectDB = require('../config/db');

async function getCollection() {
    const db = await connectDB();
    return db.collection('purchasing');
}

const Company = {
    // Show form
    async showCompany(id) {
        const collection = await getCollection();
        return await collection.find({mode:'company',_id:id}).toArray();
    },
    // List all data
    async findAll() {
        const collection = await getCollection();
        //return await collection.find({mode:'config',schema:true}).sort({fieldOrder:1}).toArray();
        return await collection.find({mode:'company'}).sort({companyname:1}).toArray();
    },

    // Find a single item by ID
    async findById(id) {
        const collection = await getCollection();
        return await collection.findOne({ _id: new ObjectId(id) });
    },

    // Add data
    async create(companyData) {
        const collection = await getCollection();
        const result = await collection.insertOne(companyData);
        return { _id: result.insertedId, ...companyData };
    },

    // Edit data
    async update(id, updateData) {
        const collection = await getCollection();
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        return result; // Returns info like matchedCount and modifiedCount
    },

    // Delete data
    async delete(id) {
        const collection = await getCollection();
        return await collection.deleteOne({ _id: new ObjectId(id) });
    }
};

module.exports = Company;