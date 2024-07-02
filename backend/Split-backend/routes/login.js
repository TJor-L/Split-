require('dotenv').config();
var express = require('express');
var router = express.Router();

/* POST login page. */
router.post('/', function(req, res, next) {
  // Initialize the MongoDB client.
  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  // Connect to the MongoDB cluster.
  async function run() {
    try {
      await client.connect();
      console.log("Connected to the database.");
      const database = client.db('test');
      const collection = database.collection('users');
      const query = { user_id: req.body.user_id };
      const user = await collection.findOne(query);
      if (!user) {
        console.log("User not found. Creating new user.")
        const query = { user_id: req.body.user_id, display_name: req.body.display_name, email: req.body.email, groups: [] };
        await collection.insertOne(query);
      }
    } catch (e) {
      // Process the login error.
      console.error(e);
    } finally {
      console.log("Closing the database connection.");
      await client.close();
    }
  }
  run().catch(console.dir);
  // Send any required data to the client.
});

module.exports = router;