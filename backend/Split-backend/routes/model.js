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

/* GET the information of a bill from a model */
router.get('/', function(req, res, next) {
  async function run() {
    // TODO.
  }
  run().catch(console.dir);
});

module.exports = router