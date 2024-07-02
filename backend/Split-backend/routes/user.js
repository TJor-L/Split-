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

/* GET user. */
router.get('/', function(req, res, next) {
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

/* POST login. */
router.post('/login', function(req, res, next) {
  async function run() {
    try {
      // Connect to the MongoDB cluster.
      await client.connect();
      console.log("Connected to the database.");
      const database = client.db('test');
      const collection = database.collection('users');
      var query = { user_id: req.body.user_id };
      var user = await collection.findOne(query);
      if (!user) {
        console.log("User not found. Creating new user.")
        var query = { user_id: req.body.user_id, display_name: req.body.display_name, email: req.body.email, friends: [], groups: [] };
        await collection.insertOne(query);
        delete query._id;
        res.send(query);
      } else {
        delete user._id;
        res.send(user);
      }
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

/* POST add friend. */
router.post('/add-friend', function(req, res, next) {
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
        const query = { user_id: req.body.friend_id };
        var friend = await collection.findOne(query);
        if (friend) {
          user.friends.push({ user_id: friend.user_id, display_name: friend.display_name });
          var update = { $set: { friends: user.friends } };
          await collection.updateOne({ user_id: user.user_id}, update);
          friend.friends.push({ user_id: user.user_id, display_name: user.display_name });
          var update = { $set: { friends: friend.friends } };
          await collection.updateOne({ user_id: friend.user_id }, update);
          delete user._id;
          res.send(user);
        } else {
          const response = { message: "Friend not found." };
          res.send(response);
          console.log("Friend not found.")
        }
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

/* POST remove friend. */
router.post('/remove-friend', function(req, res, next) {
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
        const query = { user_id: req.body.friend_id };
        var friend = await collection.findOne(query);
        if (friend) {
          user.friends = user.friends.filter(f => f.user_id !== friend.user_id);
          var update = { $set: { friends: user.friends } };
          await collection.updateOne({ user_id: user.user_id}, update);
          friend.friends = friend.friends.filter(f => f.user_id !== user.user_id);
          var update = { $set: { friends: friend.friends } };
          await collection.updateOne({ user_id: friend.user_id }, update);
          delete user._id;
          res.send(user);
        } else {
          const response = { message: "Friend not found." };
          res.send(response);
          console.log("Friend not found.")
        }
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