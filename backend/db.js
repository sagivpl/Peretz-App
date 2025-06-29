const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const dbName = "myLocalDB";

class DatabaseConnection {
  constructor() {
    this.client = new MongoClient(uri);
    this.db = null;
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(dbName);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.client.close();
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('MongoDB disconnect error:', error);
      throw error;
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  getUsersCollection() {
    return this.getDb().collection('users');
  }

  getMatchesCollection() {
    return this.getDb().collection('matches');
  }

  getPredictionsCollection() {
    return this.getDb().collection('predictions');
  }
}

const database = new DatabaseConnection();

module.exports = database;