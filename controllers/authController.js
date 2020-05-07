'use strict';
const jwt = require('jsonwebtoken');
const passport = require('passport');
const userModel = require('../models/userModel');
const graphql = require('graphql');

const login = (req, res) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', {session: false},
        async (err, user, info) => {
          try {
            if (err || !user) {
              reject(info.message);
            }
            req.login(user, {session: false}, async (err) => {
              if (err) {
                reject(err);
              }
              const token = jwt.sign(user, 'someKey');
              resolve({user, token});
            });
          }
          catch (e) {
            reject(e.message);
          }
        })(req, res);
  });
};


const checkAuthentication = (req, res, args, userSpecific) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("jwt", (err, user) => {

      if (err || !user) {
        console.log("Unauthenticated");
        reject(new Error("Unauthenticated"));
      }
      if (user.isAdmin) {
        resolve(user);
      }
      if (userSpecific) {
        if (args.id != user._id) {
          reject(new Error("Wrong user"));
        }
      }
      resolve(user);
    })(req, res);
  });
};

module.exports = {
  login,
  checkAuthentication
};
