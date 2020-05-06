'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const userModel = require('../models/userModel');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require('bcrypt');


// local strategy for username password login
passport.use(new Strategy(
  async function (username, password, done) {
    try {
      const user = await userModel.findOne({ username });
      //console.log('Local strategy', user);
      if (user === null) {
        return done(null, false, {message: 'Incorrect username.'});
      }
      if (!await bcrypt.compare(password, user.password)) {
        return done(null, false, {message: 'Incorrect password.'});
      }

      const strippedUser = user.toObject();
      delete strippedUser.password;
      return done(null, strippedUser, {message: 'Logged In Successfully'});
    }
    catch (err) {
      return done(err);
    }
  }));

// TODO: JWT strategy for handling bearer token
passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'someKey',
    },
    async (jwtPayload, done) => {

      try {
        const user = await userModel.findById(jwtPayload._id, "-password -__v");
        if (user !== null) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (e) {
        return done(null, false);
      }
    },
));

module.exports = passport;
