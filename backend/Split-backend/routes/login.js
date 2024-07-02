require('dotenv').config();
var express = require('express');
var router = express.Router();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

/* POST login. */
router.post('/', function(req, res, next) {
  async function run() {
    try {
      // Connect to the MongoDB cluster.
      await client.connect();
      console.log("Connected to the database.");
      const database = client.db('test');
      const collection = database.collection('users');
      const query = { user_id: req.body.user_id };
      var user = await collection.findOne(query);
      if (!user) {
        console.log("User not found. Creating new user.")
        const query = { user_id: req.body.user_id, display_name: req.body.display_name, email: req.body.email, groups: [] };
        user = collection.insertOne(query);
      }
      delete user._id;
      res.send(user);
    } catch (e) {
      const response = { message: e.message };
      res.send(response);
    } finally {
      console.log("Closing the database connection.");
      await client.close();
    }
  }
  run().catch(console.dir);
});

module.exports = router;