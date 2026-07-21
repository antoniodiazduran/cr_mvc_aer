// models/schemaModel.js
const { ObjectId } = require('mongodb');
const connectDB = require('../config/db');

async function getCollection() {
    const db = await connectDB();
    return db.collection('purchasing');
}

const Schema = {
    
    // List all data
    async findAll() {
        const collection = await getCollection();
        return await collection.find({mode:"config"}).sort({schema:1,fieldOrder:1}).toArray();
    },

    // Find a single item by ID
    async findById(id) {
        const collection = await getCollection();
        return await collection.findOne({ _id: new ObjectId(id) });
    },


    // Find a multiple items by schema
    async findBySchema(sec) {
        const collection = await getCollection();
        return await collection.find({ schema:sec }).sort({fieldOrder:1}).toArray();
    },

    // Find a multiple items by schema
    async findByArray(sec) {
        const collection = await getCollection();
        return await collection.find({ mode:"config" , schema:sec , htmltype:"array"}).toArray();
    },

    // Add data
    async create(schemaData) {
        // convert text to integer
        schemaData.fieldOrder = schemaData.fieldOrder*1;
        const collection = await getCollection();
        const result = await collection.insertOne(schemaData);
        return { _id: result.insertedId, ...schemaData };
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

module.exports = Schema;