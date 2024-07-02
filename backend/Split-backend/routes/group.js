require('dotenv').config();
var express = require('express');
var router = express.Router();

/* GET group. */
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
      const collection = database.collection('groups');
      const query = { group_id: req.body.group_id };
      var group = await collection.findOne(query);
      if (group) {
        delete group._id;
        res.send(group);
      } else {
        const response = { message: "Group not found." };
        res.send(response);
        console.log("Group not found.")
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

/* POST create group. */
router.post('/create', function(req, res, next) {
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
      const collection = database.collection('groups');
      const query = { name: req.body.name, members: req.body.members };
      group = await collection.insertOne(query);

      // Add an attribute group_id to the group.
      group_id = group.insertedId.toHexString();
      const update = { $set: { group_id: group_id } };
      await collection.updateOne({ name: req.body.name }, update);

      // Add the group to the user's groups.
      const user_collection = database.collection('users');
      for (var i = 0; i < req.body.members.length; i++) {
        const query = { user_id: req.body.members[i] };
        const user = await user_collection.findOne(query);
        if (user) {
          var user_groups = user.groups;
          user_groups.push(group_id);
          const update = { $set: { groups: user_groups } };
          await user_collection.updateOne({ user_id: req.body.members[i] }, update);
        } else {
          console.log("User not found.")
        }
      }
      const response = { message: "Success." };
      res.send(response);
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

/* POST add user. */
router.post('/add', function(req, res, next) {
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
      const collection = database.collection('groups');
      const query = { group_id: req.body.group_id };
      const group = await collection.findOne(query);
      if (group) {
        // Get the original group and add the new members into the group.
        var group_members = group.members;
        req.body.members.forEach(member => {
          group_members.push(member);
        });
        const update = { $set: { members: group_members } };
        await collection.updateOne({ group_id: req.body.group_id }, update);

        // Add the group to the user's groups.
        const user_collection = database.collection('users');
        for (var i = 0; i < req.body.members.length; i++) {
          const query = { user_id: req.body.members[i] };
          const user = await user_collection.findOne(query);
          if (user) {
            var user_groups = user.groups;
            user_groups.push(req.body.group_id);
            const update = { $set: { groups: user_groups } };
            await user_collection.updateOne({ user_id: req.body.members[i] }, update);
          } else {
            console.log("User not found.")
          }
        }
        const response = { message: "Success." };
        res.send(response);
      } else {
        const response = { message: "Group not found." };
        res.send(response);
        console.log("Group not found.")
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

/* POST remove user. */
router.post('/remove', function(req, res, next) {
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
      const collection = database.collection('groups');
      const query = { group_id: req.body.group_id };
      const group = await collection.findOne(query);
      if (group) {
        // Get the original group and remove the members from the group.
        var group_members = group.members;
        req.body.members.forEach(member => {
            const index = group_members.indexOf(member);
            if (index > -1) {
              group_members.splice(index, 1);
            }
        });
        const update = { $set: { members: group_members } };
        await collection.updateOne({ group_id: req.body.group_id }, update);

        // Remove the group from the user's groups.
        const user_collection = database.collection('users');
        for (var i = 0; i < req.body.members.length; i++) {
          const query = { user_id: req.body.members[i] };
          const user = await user_collection.findOne(query);
          if (user) {
            var user_groups = user.groups;
            const index = user_groups.indexOf(req.body.group_id);
            if (index > -1) {
              user_groups.splice(index, 1);
            }
            const update = { $set: { groups: user_groups } };
            await user_collection.updateOne({ user_id: req.body.members[i] }, update);
          } else {
            console.log("User not found.")
          }
        }
        const response = { message: "Success." };
        res.send(response);
      } else {
        const response = { message: "Group not found." };
        res.send(response);
        console.log("Group not found.")
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