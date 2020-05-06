const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const topicSchema = new Schema({
  title: {type: String, required: true},
  users: [{type: mongoose.Types.ObjectId, ref: 'User'}],
  description: {type: String, required: true},
  media: {type: String, required: false},
  dateCreated: {type: String, required: true},
  posts: [{type: mongoose.Types.ObjectId, ref: 'Post'}]
});

module.exports = mongoose.model('Topic', topicSchema);