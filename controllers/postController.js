// Controller
'use strict';
const postModel = require('../models/postModel');
const topicModel = require('../models/topic');

const create_post = async (req, res) => {

  console.log(req.body['x-access-token']);

  const post = await postModel.create({
      user: req.body.access_token,
      title: req.body.title,
      text: req.body.text,
      media: req.body.media,
      dateCreated: req.body.dateCreated,
      topic: req.body.topic   
    });
  let topic = await topicModel.findById(req.body.topic);
  topic.posts.push(post.id);
  await topic.save();
  res.json(post.id);
}
   
module.exports = {
  create_post
};
