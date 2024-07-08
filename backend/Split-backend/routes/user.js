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

/* GET a user. */
router.get('/', function(req, res, next) {
  async function run() {
    try {
      // Connect to the MongoDB cluster.
      await client.connect();
      const database = client.db('test');
      const collection = database.collection('users');
      var query = { email: req.body.email };
      var user = await collection.findOne(query);
      if (user) {
        user.success = true;
        delete user._id;
        res.send(user);
      } else {
        const response = { success: false, message: "User not found." };
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

/* POST login. */
router.post('/login', function(req, res, next) {
  async function run() {
    try {
      // Connect to the MongoDB cluster.
      await client.connect();
      console.log("Connected to the database.");
      const database = client.db('test');
      const collection = database.collection('users');
      var query = { email: req.body.email };
      var user = await collection.findOne(query);
      if (!user) {
        var query = { user_id: req.body.user_id, display_name: req.body.display_name, email: req.body.email, friends: [], groups: [], transactions: [] };
        await collection.insertOne(query);
        user = await collection.findOne({ email: req.body.email });
        user.success = true;
        delete user._id;
        res.send(user);
      } else {
        user.success = true;
        delete user._id;
        res.send(user);
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

/* POST add a friend. */
router.post('/add-friend', function(req, res, next) {
  async function run() {
    try {
      // Connect to the MongoDB cluster.
      await client.connect();
      const database = client.db('test');
      const collection = database.collection('users');
      var query = { email: req.body.email };
      var user = await collection.findOne(query);
      if (user) {
        var query = { email: req.body.friend_email };
        var friend = await collection.findOne(query);
        if (friend) {
          user.friends.push({ email: friend.email, display_name: friend.display_name });
          var update = { $set: { friends: user.friends } };
          await collection.updateOne({ email: user.email}, update);
          friend.friends.push({ email: user.email, display_name: user.display_name });
          var update = { $set: { friends: friend.friends } };
          await collection.updateOne({ email: friend.email }, update);
          delete user._id;
          res.send(user);
        } else {
          const response = { success: false, message: "Friend not found." };
          res.send(response);
        }
      } else {
        const response = { success: false, message: "User not found." };
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

/* POST remove a friend. */
router.post('/remove-friend', function(req, res, next) {
  async function run() {
    try {
      // Connect to the MongoDB cluster.
      await client.connect();
      console.log("Connected to the database.");
      const database = client.db('test');
      const collection = database.collection('users');
      var query = { email: req.body.email };
      var user = await collection.findOne(query);
      if (user) {
        // Check whether there is an uncompleted transaction between the user and the friend.
        const transaction_collection = database.collection('transactions');
        var query = { payer: req.body.email, payee: req.body.friend_email, completed: false };
        var transaction = await transaction_collection.findOne(query);
        if (!transaction) {
          var query = { payer: req.body.friend_email, payee: req.body.user_email, completed: false };
          var transaction = await transaction_collection.findOne(query);
        }
        if (transaction) {
          const response = { success: false, message: "There is an uncompleted transaction between you and the friend." };
          res.send(response);
          await client.close();
          return;
        }

        // Remove the friend from the user's friends.
        var query = { email: req.body.friend_email };
        var friend = await collection.findOne(query);
        if (friend) {
          user.friends = user.friends.filter(f => f.email !== friend.email);
          var update = { $set: { friends: user.friends } };
          await collection.updateOne({ email: user.email}, update);
          friend.friends = friend.friends.filter(f => f.email !== user.email);
          var update = { $set: { friends: friend.friends } };
          await collection.updateOne({ email: friend.email }, update);
          user.success = true;
          delete user._id;
          res.send(user);
        } else {
          const response = { success: false, message: "Friend not found." };
          res.send(response);
        }
      } else {
        const response = { success: false, message: "User not found." };
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

/* POST delete user. */
router.post('/delete', function(req, res, next) {
  async function run() {
    try {
      // Connect to the MongoDB cluster.
      await client.connect();
      const database = client.db('test');
      const collection = database.collection('users');
      var query = { email: req.body.email };
      var user = await collection.findOne(query);
      if (user) {
        // Check whether there are uncompleted transactions related to the user.
        const transaction_collection = database.collection('transactions');
        var query = { payer: req.body.email, completed: false };
        var transaction = await transaction_collection.findOne(query);
        if (!transaction) {
          var query = { payee: req.body.email, completed: false };
          var transaction = await transaction_collection.findOne(query);
        }
        if (transaction) {
          const response = { success: false, message: "There is an uncompleted transaction related to the user." };
          res.send(response);
          await client.close();
          return;
        }

        // Remove the user from friends' friends.
        for (var friend of user.friends) {
          var query = { email: friend.email };
          var friend = await collection.findOne(query);
          if (friend) {
            friend.friends = friend.friends.filter(f => f.email !== user.email);
            var update = { $set: { friends: friend.friends } };
            await collection.updateOne({ email: friend.email }, update);
          }
        }

        // Remove the user from groups' members.
        const group_collection = database.collection('groups');
        var query = { members: req.body.email };
        var groups = await group_collection.find(query).toArray();
        for (var group of groups) {
          group.members = group.members.filter(m => m !== user.email);
          var update = { $set: { members: group.members } };
          await group_collection.updateOne({ group_id: group.group_id }, update);
        }

        // Remove the user from the database.
        await collection.deleteOne({ email: user.email });
        res.send(user);
      } else {
        const response = { success: false, message: "User not found." };
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