'use strict';
require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');

const mongoose = require('mongoose');
const http = require('http');

const https = require('https');
const fs = require('fs');

const db = require('./utils/db')
const cors = require('cors')
const bodyParser = require('body-parser')

const passport = require('./utils/pass.js')
const authRoute = require('./routes/authRoute')

const sslkey = fs.readFileSync('./ssl-key.pem');
const sslcert = fs.readFileSync('./ssl-cert.pem')

const graphQlHttp = require('express-graphql');
const schema = require('./schema/schema');


app.use(cors());

const options = {
      key: sslkey,
      cert: sslcert
};

db.on('connected', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || "development";
    if (process.env.NODE_ENV === "production") {
       require("./production")(app, process.env.PORT);
    } else {
       require("./localhost")(
           app,
           process.env.HTTPS_PORT,
           process.env.HTTP_PORT
       );
    }
 });


app.use(express.static(path.join(__dirname, '/public')));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/post', require('./routes/postRoute'));

app.use('/auth', require('./routes/authRoute'));


app.get('/', (req, res) => {
    res.send('Hello Secure World!');
});

app.use('/graphql', (req, res) => {
    graphQlHttp({schema, graphiql: true, context: {req, res}})(req,
        res);
  });
