// index.js
require('dotenv').config();

const express = require('express');

const  bodyParser = require('body-parser'),
  DEFAULT_BODY_SIZE_LIMIT = 1024 * 1024 * 10,
  DEFAULT_PARAMETER_LIMIT = 10000;

const bodyParserJsonConfig = () => ({
   parameterLimit: DEFAULT_PARAMETER_LIMIT,
   limit: DEFAULT_BODY_SIZE_LIMIT
});

const app = express();
const {ask, initialize} = require('./controller');
app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json(bodyParserJsonConfig()));

app.get('/', (req, res) => res.send('Node.JS with PostgreSQL and IBM Chatbot'))
app.post('/ask', ask)
app.get('/api/session', initialize);

app.listen(3000, () => console.log('Listening on port 3000'))