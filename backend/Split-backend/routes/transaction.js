require('dotenv').config()
var express = require('express')
var router = express.Router()

const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

/* GET transaction. */
router.get('/', function(req, res, next) {
  async function run() {
    try {
      // Connect to the MongoDB cluster.
      await client.connect();
      console.log("Connected to the database.");
      const database = client.db('test');
      const collection = database.collection('transactions');
      var query = { transaction_id: req.body.transaction_id };
      var transaction = await collection.findOne(query);
      if (transaction) {
        transaction.success = true;
        delete transaction._id;
        res.send(transaction);
      } else {
        const response = { success: false, message: "Transaction not found." };
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

/* POST create transaction. */
router.post('/create', function(req, res, next) {
  async function run() {
    try {
      // Connect to the MongoDB cluster.
      await client.connect();
      console.log("Connected to the database.");
      const database = client.db('test');
      const collection = database.collection('transactions');
      var query = { payer: req.body.payer, payee: req.body.payee, amount: req.body.amount, date: req.body.date, completed: false };
      if (req.body.group_id) {
        query.group_id = req.body.group_id;
      }
      var transaction = await collection.insertOne(query);
      
      // Add an attribute transaction_id to the transaction.
      const transaction_id = transaction.insertedId.toHexString();
      var update = { $set: { transaction_id: transaction_id } };
      await collection.updateOne({ _id: transaction.insertedId }, update);

      // Add the transaction to related users' transactions.
      const user_collection = database.collection('users');
      var update = { $push: { transactions: transaction_id } };
      await user_collection.updateMany({ email: { $in: [req.body.payer, req.body.payee] } }, update);

      // If the transaction is related to a group, add the transaction to the group's transactions.
      if (req.body.group_id) {
        const group_collection = database.collection('groups');
        var update = { $push: { transactions: transaction_id } };
        await group_collection.updateOne({ group_id: req.body.group_id }, update);
      }
      var transaction = await collection.findOne({ transaction_id: transaction_id });
      transaction.success = true;
      delete transaction._id;
      res.send(transaction);
    } catch (e) {
      const response = { success: false, message: e.message }
      res.send(response)
    } finally {
      await client.close()
    }
  }
  run().catch(console.dir)
});

/* POST complete transaction. */
router.post('/complete', function(req, res, next) {
  async function run() {
    try {
      // Connect to the MongoDB cluster.
      await client.connect();
      console.log("Connected to the database.");
      const database = client.db('test');
      const collection = database.collection('transactions');
      var query = { transaction_id: req.body.transaction_id };
      var update = { $set: { completed: true } };
      await collection.updateOne(query, update);
      const transaction = await collection.findOne(query);
      transaction.success = true;
      delete transaction._id;
      res.send(transaction);
    } catch (e) {
      const response = { success: false, message: e.message }
      res.send(response)
    } finally {
      await client.close()
    }
  }
  run().catch(console.dir)
});

module.exports = router;