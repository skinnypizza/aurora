require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

async function fixIds() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db(process.env.MONGO_DB);
  
  const projects = await db.collection('projects').find({}).toArray();
  console.log(`Found ${projects.length} projects. Checking ownerId types...`);
  
  for (const p of projects) {
    if (typeof p.ownerId === 'string') {
      console.log(`Fixing project ${p.id}: converting ownerId ${p.ownerId} to ObjectId`);
      await db.collection('projects').updateOne(
        { _id: p._id },
        { $set: { ownerId: new ObjectId(p.ownerId) } }
      );
    }
  }
  
  console.log('Done.');
  await client.close();
}

fixIds().catch(console.error);
