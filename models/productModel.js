// models/productModel.js
const { ObjectId } = require('mongodb');
const connectDB = require('../config/db');

async function getCollection() {
    const db = await connectDB();
    return db.collection('purchasing');
}

const Product = {
    // List all data
    async findAll() {
        const collection = await getCollection();
        return await collection.find({ArrivedDate:{$type:10}}).sort({"DateTime":-1}).toArray();
    },

    // Find a single item by ID
    async findById(id) {
        const collection = await getCollection();
        return await collection.findOne({ _id: new ObjectId(id) });
    },

    // Add data
    async create(productData) {
        const collection = await getCollection();
        const result = await collection.insertOne(productData);
        return { _id: result.insertedId, ...productData };
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

module.exports = Product;