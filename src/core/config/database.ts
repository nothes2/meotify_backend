import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017")
export const db = client.db("meowtify")

export async function connectDB() {
    await client.connect();
    console.log("✅ Database Connected Successfully!");
    
}