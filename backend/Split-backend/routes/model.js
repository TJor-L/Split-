import OpenAI from 'openai';

require('dotenv').config();
var express = require('express');
var request = require('request');
var router = express.Router();

const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const openai = new OpenAI();

/* GET the information of a bill from a model */
router.get('/', function(req, res, next) {
  async function run() {
    // Upload the image to PICUI.
    const header = {
      'Authorization': `Bearer ${process.env.PICUI_KEY}`,
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    };
    const postData = {
      'file': req.body.image,
      'permission': 0
    }
    var img_url;
    request.post({
      url: 'https://api.picui.com/v1/upload',
      headers: header,
      formData: postData
    }, function (error, response, body) {
      if (error) {
        console.error('Error:', error);
        return;
      }
      img_url = JSON.parse(body).data.links.url;
    });

    // Get the information of the bill from ChatGPT-4o.
    var response = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Some text.' // To be changed to a proper prompt.
            }, {
              type: 'image_url',
              image_url: img_url
            }
          ]
        }
      ]
    });
    res.send({'success': true, 'text': response.data.choices[0]});
  }
  run().catch(console.dir);
});

module.exports = router