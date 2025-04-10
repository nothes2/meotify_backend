import { ClientSession, MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";
const dbName = "meowtify";

let client: MongoClient;
let db: ReturnType<MongoClient["db"]>;

export async function connectDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log("✅ Database Connected Successfully!");
  }
  return {client, db};
}

export function getDB() {
  if (!db) {
    throw new Error("❌ Database not connected. Call connectDB() first.");
  }
  return db;
}

export function getClient(): MongoClient {
    if (!client) {
      throw new Error("❌ MongoClient not initialized. Call connectDB() first.");
    }
    return client;
  }

  export function startSession(): ClientSession {
    if (!client) {
      throw new Error("❌ MongoClient not initialized. Call connectDB() first.");
    }
    return client.startSession();
  }