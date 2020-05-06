const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, unique: true},
  password: {type: String, required: true},
  fullName: {type: String, required: true},
  //privileges: {type: Enumerator, required: true},
  dateCreated: {type: String, required: true},
  topics: [{type: mongoose.Types.ObjectId, ref: 'Topic'}],
  isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);