require('dotenv').config();
var express = require('express');
var router = express.Router();

/* POST create group page. */
router.post('/create', function(req, res, next) {
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
      const collection = database.collection('groups');
      var group_members = [];
      if (req.body.members) {
        group_members = req.body.members;
      }
      const query = { group_id: req.body.group_id, name: req.body.name, members: group_members };
      await collection.insertOne(query);
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

/* POST add user page. */
router.post('/add', function(req, res, next) {
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
      const collection = database.collection('groups');
      const query = { group_id: req.body.group_id };
      const group = await collection.findOne(query);
      if (group) {
        var group_members = group.members;
        req.body.members.forEach(member => {
          group_members.push(member);
        });
        const update = { $set: { members: group_members } };
        await collection.updateOne({ group_id: req.body.group_id }, update);
      } else {
        console.log("Group not found.")
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

/* POST remove user page. */
router.post('/remove', function(req, res, next) {
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
      const collection = database.collection('groups');
      const query = { group_id: req.body.group_id };
      const group = await collection.findOne(query);
      if (group) {
        var group_members = group.members;
        req.body.members.forEach(member => {
            const index = group_members.indexOf(member);
            if (index > -1) {
              group_members.splice(index, 1);
            }
        });
        const update = { $set: { members: group_members } };
        await collection.updateOne({ group_id: req.body.group_id }, update);
      } else {
        console.log("Group not found.")
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