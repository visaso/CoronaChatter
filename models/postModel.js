const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: {type: mongoose.Types.ObjectId, ref: 'User'},
  title: {type: String, required: true},
  text: {type: String, required: true},
  media: {type: String, required: false},
  dateCreated: {type: String, required: true},
  comments: [{type: mongoose.Types.ObjectId, ref: 'Comment'}],
  upvoters: [{type: mongoose.Types.ObjectId, ref: 'User'}],
  topic: {type: mongoose.Types.ObjectId, ref: 'Topic'}
});

module.exports = mongoose.model('Post', postSchema);