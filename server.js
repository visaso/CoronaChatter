'use strict';
require('dotenv').config();

const express = require('express');
const app = express();
//const port = 3000;
//const httpsPort = 8000;
const path = require('path');

const mongoose = require('mongoose');
const tester = require('./models/test');
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

const postModel = require('./models/postModel');

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

app.get('/test', async (req, res) => {
    const test = await tester.create({ name: 'Thomas', age: 12 })
    res.json(test.id);
})

app.get('/', (req, res) => {
    res.send('Hello Secure World!');
});

app.use('/graphql', (req, res) => {
    console.log('Graphql');
    graphQlHttp({schema, graphiql: true, context: {req, res}})(req,
        res);
  });


app.get('/generate', async (req, res) => {

    const userModel = require('./models/userModel');
    const postModel = require('./models/postModel');
    const test = await userModel.create({ username: 'Thomas', password: 'hello', fullName : 'Thomas Manuelson', dateCreated : Date.now });
    

    const post = await postModel.create({ user: test.id , title: 'This is a title', text: 'Something Something', dateCreated: Date.now })

    res.json(post.id);
}) 


const bcrypt = require('bcrypt');

const saltRound = 12; //okayish in 2020

const userModel = require('./models/userModel');
app.post('/user', async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, saltRound);
        const myUser = await userModel.create({ username: req.body.username, password: hash, fullName: "Tester Dude", dateCreated: "4.5.2020" })
        res.json(myUser.id);
      } catch (e) {
        console.log(e.message);
      }
});