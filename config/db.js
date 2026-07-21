// config/db.js


const { MongoClient } = require('mongodb');

//const url = 'mongodb://localhost:27017'; // Replace with your connection string
const url = process.env.MONGO_URI;
const dbName = process.env.DATA;

let dbInstance = null;

async function connectDB() {
    if (dbInstance) return dbInstance;

    try {
        const client = new MongoClient(url);
        await client.connect();
        console.log('Connected successfully to MongoDB');
        dbInstance = client.db(dbName);
        return dbInstance;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}

module.exports = connectDB;