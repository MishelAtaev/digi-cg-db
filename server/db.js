const { MongoClient } = require("mongodb");
require("dotenv").config();

const { MONGO_URI } = process.env;

const client = new MongoClient(MONGO_URI);

let dbConnection;

const connectToDb = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    dbConnection = client.db("diginexus");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
  }
};

const getDb = () => dbConnection;

module.exports = { connectToDb, getDb };
