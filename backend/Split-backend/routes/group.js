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

/* GET a group. */
router.get('/', function(req, res, next) {
  async function run() {
    try {
      // Connect to the MongoDB cluster.
      await client.connect();
      const database = client.db('test');
      const collection = database.collection('groups');
      var query = { group_id: req.body.group_id };
      var group = await collection.findOne(query);
      if (group) {
        delete group._id;
        group.success = true;
        res.send(group);
      } else {
        const response = { success: false, message: "Group not found." };
        res.send(response);
      }
    } catch (e) {
      const response = { success: false, message: e.message };
      res.send(response);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});

/* POST create a group. */
router.post('/create', function(req, res, next) {
  async function run() {
    try {
      // Connect to the MongoDB cluster.
      await client.connect();
      const database = client.db('test');
      const collection = database.collection('groups');
      var query = { name: req.body.name, members: req.body.members, transactions: [] };
      var group = await collection.insertOne(query);

      // Add an attribute group_id to the group.
      const group_id = group.insertedId.toHexString();
      var update = { $set: { group_id: group_id } };
      await collection.updateOne({ _id: group.insertedId }, update);

      // Add the group to the user's groups.
      const user_collection = database.collection('users');
      for (var i = 0; i < req.body.members.length; i++) {
        var query = { email: req.body.members[i] };
        var user = await user_collection.findOne(query);
        if (user) {
          var user_groups = user.groups;
          user_groups.push(group_id);
          var update = { $set: { groups: user_groups } };
          await user_collection.updateOne({ email: req.body.members[i] }, update);
        }
      }
      var group = await collection.findOne({ group_id: group_id });
      group.success = true;
      delete group._id;
      res.send(group);
    } catch (e) {
      const response = { success: false, message: e.message };
      res.send(response);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});

/* POST add users. */
router.post('/add', function(req, res, next) {
  async function run() {
    try {
      // Connect to the MongoDB cluster.
      await client.connect();
      const database = client.db('test');
      const collection = database.collection('groups');
      var query = { group_id: req.body.group_id };
      var group = await collection.findOne(query);
      if (group) {
        // Get the original group and add the new members into the group.
        req.body.members.forEach(member => {
          group.members.push(member);
        });
        var update = { $set: { members: group.members } };
        await collection.updateOne({ group_id: group.group_id }, update);

        // Add the group to the user's groups.
        const user_collection = database.collection('users');
        for (var i = 0; i < req.body.members.length; i++) {
          var query = { email: req.body.members[i] };
          var user = await user_collection.findOne(query);
          if (user) {
            user.groups.push(group.group_id);
            var update = { $set: { groups: user.groups } };
            await user_collection.updateOne({ email: req.body.members[i] }, update);
          }
        }
        group.success = true;
        delete group._id;
        res.send(group);
      } else {
        const response = { success: false, message: "Group not found." };
        res.send(response);
      }
    } catch (e) {
      const response = { message: e.message };
      res.send(response);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});

/* POST remove a user. */
router.post('/remove', function(req, res, next) {
  async function run() {
    try {
      // Connect to the MongoDB cluster.
      await client.connect();
      const database = client.db('test');
      const collection = database.collection('groups');
      var query = { group_id: req.body.group_id };
      var group = await collection.findOne(query);
      if (group) {
        // Check whether there is an uncompleted transaction between the user and the group.
        const transaction_collection = database.collection('transactions');
        var query = { payer: req.body.member, group_id: req.body.group_id, completed: false };
        var transaction = await transaction_collection.findOne(query);
        if (!transaction) {
          var query = { payee: req.body.member, group_id: req.body.group_id, completed: false };
          var transaction = await transaction_collection.findOne(query);
        }
        if (transaction) {
          const response = { success: false, message: "There is an uncompleted transaction between the user and the group." };
          res.send(response);
          await client.close();
          return;
        }

        // Get the original group and remove the member from the group.
        group.members = group.members.filter(e => e !== req.body.member);
        var update = { $set: { members: group.members } };
        await collection.updateOne({ group_id: group.group_id }, update);

        // Remove the group from the user's groups.
        const user_collection = database.collection('users');
        var query = { member: req.body.member };
        var user = await user_collection.findOne(query);
        if (user) {
          user.groups = user.groups.filter(e => e !== group.group_id);
          var update = { $set: { groups: user.groups } };
          await user_collection.updateOne({ user: req.body.member }, update);
        }
        group.success = true;
        delete group._id;
        res.send(group);
      } else {
        const response = { success: false, message: "Group not found." };
        res.send(response);
      }
    } catch (e) {
      const response = { success: false, message: e.message };
      res.send(response);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});

/* POST delete a group. */
router.post('/delete', function(req, res, next) {
  async function run() {
    try {
      // Connect to the MongoDB cluster.
      await client.connect();
      const database = client.db('test');
      const collection = database.collection('groups');
      var query = { group_id: req.body.group_id };
      var group = await collection.findOne(query);
      if (group) {
        // Check whether there is an uncompleted transaction in the group.
        const transaction_collection = database.collection('transactions');
        var query = { group_id: req.body.group_id, completed: false };
        var transaction = await transaction_collection.findOne(query);
        if (transaction) {
          const response = { success: false, message: "There is an uncompleted transaction in the group." };
          res.send(response);
          await client.close();
          return;
        }

        // Remove the group from the users' groups.
        const user_collection = database.collection('users');
        for (var i = 0; i < group.members.length; i++) {
          var query = { email: group.members[i] };
          var user = await user_collection.findOne(query);
          if (user) {
            user.groups = user_groups.filter(e => e !== group.group_id);
            var update = { $set: { groups: user_groups } };
            await user_collection.updateOne({ email: group.members[i] }, update);
          }
        }

        // Delete the group.
        var query = { group_id: req.body.group_id };
        await collection.deleteOne(query);
        group.success = true;
        delete group._id;
        res.send(group);
      } else {
        const response = { success: false, message: "Group not found." };
        res.send(response);
      }
    } catch (e) {
      const response = { success: false, message: e.message };
      res.send(response);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});

module.exports = router;