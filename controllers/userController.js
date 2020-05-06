// Controller
'use strict';
const userModel = require('../models/userModel');

const bcrypt = require('bcrypt');

const saltRound = 12; //okayish in 2020


const user_list_get = async (req, res) => {
  try {
    console.log('Waiting for users')
    const users = await userModel.find();
    res.json(users);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({message: e.message});
  }
};

const user_get = async (req, res) => {
  try {
    console.log('Waiting for user')
    const user = await userModel.findById(req.params.id);
    res.json(user);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({message: e.message});
  }
};

const log_form = (req, res) => {
  console.log("Name is : ", req.body.name);
  //console.log("Email is : ", req.body.email);
}

const user_post = (req, res) => {
  console.log('data from form', req.body);
  res.send('With this endpoint you can add users');
};


const getUserLogin = async (username) => {
  const user = await userModel.findOne({username: username});
  console.log(user);
  if (user.username === username) {
    return user;
  } else {
    console.log('Not logged in');
  }
};

const create_user = async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, saltRound);
  const myUser = await userModel.create({ username: req.body.username, password: hash })
    res.json(myUser.id);
}
   
module.exports = {
  user_list_get,
  user_get,
  log_form,
  user_post,
  getUserLogin,
  create_user
};
