import { MongoClient } from "mongodb";
import { mockUsers, mockMatches, mockPredictions } from "../services/mockData";

const uri = "mongodb://localhost:27017";
const dbName = "myLocalDB";

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    // Insert users
    const usersCol = db.collection("users");
    await usersCol.deleteMany({});
    await usersCol.insertMany(mockUsers);

    // Insert matches
    const matchesCol = db.collection("matches");
    await matchesCol.deleteMany({});
    await matchesCol.insertMany(mockMatches);

    // Insert predictions
    const predictionsCol = db.collection("predictions");
    await predictionsCol.deleteMany({});
    await predictionsCol.insertMany(mockPredictions);

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await client.close();
  }
}

seed(); 