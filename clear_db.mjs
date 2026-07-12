import { MongoClient } from 'mongodb';

async function main() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error('DATABASE_URL is not defined in the environment.');
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    
    console.log('Dropping database collections...');
    const collections = await db.collections();
    for (const collection of collections) {
      await collection.drop();
      console.log(`Dropped collection: ${collection.collectionName}`);
    }
    console.log('Database cleared.');
  } finally {
    await client.close();
  }
}

main().catch(console.error);
