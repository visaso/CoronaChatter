const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user: {type: mongoose.Types.ObjectId, ref: 'User'},
  //  post: {type: mongoose.Types.ObjectId, ref: 'Post'},
  text: {type: String, required: true},
  dateCreated: {type: String, required: true},
  upvoters: [{type: mongoose.Types.ObjectId, ref: 'User'}],
  post: {type: mongoose.Types.ObjectId, ref: 'Post'},
});

module.exports = mongoose.model('Comment', commentSchema);