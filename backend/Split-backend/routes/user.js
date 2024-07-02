var express = require('express');
var router = express.Router();

/* GET user. */
router.get('/', function(req, res, next) {
  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  async function run() {
    try {
      // Connect to the MongoDB cluster.
      await client.connect();
      console.log("Connected to the database.");
      const database = client.db('test');
      const collection = database.collection('users');
      const query = { user_id: req.body.user_id };
      var user = await collection.findOne(query);
      if (user) {
        delete user._id;
        res.send(user);
      } else {
        const response = { message: "User not found." };
        res.send(response);
        console.log("User not found.")
      }
    } catch (e) {
      const response = { message: e.message };
      res.send(response);
      console.error(e);
    } finally {
      console.log("Closing the database connection.");
      await client.close();
    }
  }
  run().catch(console.dir);
});

module.exports = router;