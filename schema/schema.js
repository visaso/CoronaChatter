'use strict';

const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLBoolean,
  GraphQLNonNull,
} = require('graphql');

const bcrypt = require('bcrypt');
const salt = 12;

const authController = require('../controllers/authController');

//Models
const user = require('../models/userModel');
const post = require('../models/postModel');
const comment = require('../models/commentModel');
const topic = require('../models/topic');


const userType = new GraphQLObjectType({
    name: 'user',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        fullName: { type: GraphQLString },
        dateCreated: { type: GraphQLString },
        topics: {
            type: GraphQLList(topicType),
            resolve (parent, args) {
                return topic.find({_id : parent.topics});

            }
        },
        token: { type: GraphQLString },
    }),
});

const postType = new GraphQLObjectType({
    name: 'post',
    fields: () => ({
        id: { type: GraphQLID },
        user: {
            type: userType,
            resolve(parent, args) {
                return user.findById(parent.user);
            }
        },
        title: { type : GraphQLString },
        text: { type : GraphQLString },
        media: { type : GraphQLString },
        dateCreated: { type : GraphQLString },
        comments: {
            type: GraphQLList(commentType),
            resolve (parent, args) {
                return comment.find({ _id: parent.comments});
            }
        },
        upvoters: {
            type: GraphQLList(userType),
            resolve(parent, args) {
                return user.find({ _id: parent.upvoters })
            }
        },
        
        topic: {
            type: topicType,
            resolve (parent, args) {
                return topic.findById(parent.topic);
            }
        }
        
    })
});

const topicType = new GraphQLObjectType({
    name: 'topic',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type : GraphQLString },
        users: {
            type: GraphQLList(userType),
            resolve(parent, args) {
                return user.find({ id: parent.users });
            }
        },
        description: { type : GraphQLString },
        media: { type : GraphQLString },
        dateCreated: { type : GraphQLString },
        posts : {
            type: GraphQLList(postType),
            resolve(parent, args) {
                return post.find({ _id: parent.posts });
            }
        }
    })
});

const commentType = new GraphQLObjectType({
    name: 'comment',
    fields: () => ({
        id: { type: GraphQLID },
        user: {
            type: userType,
            resolve (parent, args) {
                return user.findById(parent.user);
            }
        },
        text: { type: GraphQLString },
        dateCreated: { type: GraphQLString },
        upvoters: { 
            type: GraphQLList(userType),
            resolve(parent, args) {
                return user.find({ _id: parent.upvoters });
            }    
        },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        login: {
            type: userType,
            description: 'Login to a user',
            args: {
                username: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve: async (parent, args, { req, res }) => {
                req.body = args;
                try {
                const authController = require('../controllers/authController');
                const response = await authController.login(req, res);
                
                return {
                    id: response.user._id,
                    ...response.user,
                    token: response.token
                }
                
                } catch (e) {
                    console.log(e.message);
                }
            },
        },
        user: {
            type: userType,
            description: 'Get single user by ID',
            args: { id: { type: GraphQLID } },
            resolve (parent, args, { req, res }) {
                return user.findById(args.id);
            },
        },
        users: {
            type: new GraphQLList(userType),
            description: 'Get All users',
            resolve(parent, args) {
                return user.find();
            },
        },
        topicsUserIsIn: {
            type: new GraphQLList(topicType),
            description: 'Get list of topics user is subscribed to',
            args: { id: { type: GraphQLID } },
            resolve (parent, args) {
                return topic.find({ id: args.topics });
            }
        },
        topic: {
            type: topicType,
            description: 'Get single Topic by ID',
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return topic.findById(args.id);
            },
        },
        topics: {
            type: new GraphQLList(topicType),
            description: 'Get All Topics',
            resolve(parent, args) {
                return topic.find();
            },
        },
        post: {
            type: postType,
            description: 'Get single Post by ID',
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return post.findById(args.id);
            },
        },
        posts: {
            type: new GraphQLList(postType),
            description: 'Get All Posts',
            resolve(parent, args) {
                return post.find();
            },
        },
        comment: {
            type: commentType,
            description: 'Get single Comment by ID',
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return post.findById(args.id);
            },
        },
        commentsInPost: {
            type: new GraphQLList(commentType),
            description: 'Get All Comments inside a Post',
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return post.find( { id: args.id });
            },
        },
        postsForUser: {
            type: new GraphQLList(postType),
            description: 'Get all posts for user',
            args: { id : { type: GraphQLID } },
            resolve(parent, args) {
                
            }

        }
    },
});

const Mutation = new GraphQLObjectType({
    name: 'MutationType',
    description: 'Mutations...',
    fields: {
      addUser: {
        type: userType,
        description: 'Add a user',
        args: {
          username: {type: new GraphQLNonNull(GraphQLString)},
          password: {type: GraphQLString},
          fullName: {type: GraphQLString},
          dateCreated: {type: GraphQLString},
          isAdmin: {type: GraphQLBoolean}
        },
        resolve: async (parent, args) => {
          args.password = await bcrypt.hash(args.password, salt);
          const newUser = new user(args);
          try {
            return await newUser.save();
          } catch (e) {
            return new Error(e.message);
          }
        },
      },
      deleteUser: {
        type: userType,
        description: 'Delete a user',
        args: { 
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (parent, args, { req, res }) => {
            const userSpecific = true;
            try {
                await authController.checkAuthentication(req, res, args, userSpecific);

                await user.findByIdAndDelete(args.id);
            } catch (e) {
                throw new Error(e.message);
            }
        }
      },
      updateUser: {
        type: userType,
        description: 'Update user information',
        args: {
            id : { type: new GraphQLNonNull(GraphQLID) },
            username: { type: GraphQLString },
            password: { type: GraphQLString },
        },
        resolve: async (parent, args, { req, res }) => {
            const userSpecific = true;
            try {
                await authController.checkAuthentication(req, res, args, userSpecific);
                await user.updateOne(
                    { _id: args.id },
                    { username: args.username },
                    { password: args.password = await bcrypt.hash(args.password, salt) });
            } catch (e) {
                throw new Error(e.message);
            }
        }
      },
      addTopic: {
          type: topicType,
          description: "Add a topic",
          args: {
            title: {type: new GraphQLNonNull(GraphQLString)},
            description: {type: GraphQLString},
            media: {type: GraphQLString},
            dateCreated: {type: GraphQLString},
          },
          resolve: async (parent, args) => {
              const newTopic = new topic(args);
              try {
                  return await newTopic.save();
              } catch (e) {
                  return new Error(e.message);
              }
          }
      },
      deleteTopic: {
        type: topicType,
        description: "Delete topic by id",
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (parent, args, { req, res }) => {
            try {
                await authController.checkAuthentication(req, res, args, userSpecific);
                await topic.findByIdAndDelete(args.id);
            } catch (e) {
                throw new Error(e.message);
            }
        }
      },
      addPost: {
          type: postType,
          description: "Add a post",
          args: {
              user: {type: GraphQLID },
              title: {type: new GraphQLNonNull(GraphQLString)},
              topic: {type: new GraphQLNonNull(GraphQLString)},
              text: {type: new GraphQLNonNull(GraphQLString)},
              media: {type: GraphQLString},
              dateCreated: {type: GraphQLString},
          },
          resolve: async (parent, args) => {
              let newPost = new post(args);

              try {
                  newPost = await newPost.save();
                  const topicModel = require('../models/topic');
                  let topic = await topicModel.findById(args.topic);
                  topic.posts.push(newPost.id);
                  topic.save();
                  return newPost;
              } catch (e) {
                  return new Error(e.message);
              }
          }
      },
      addComment: {
          type: commentType,
          description: "Add a comment",
          args: {
              user: {type: GraphQLID },
              post: {type: GraphQLID },
              text: {type: new GraphQLNonNull(GraphQLString)},
              dateCreated: {type: GraphQLString},
          },
          resolve: async (parent, args) => {
              let newComment = new comment(args);
              try {
                  newComment = await newComment.save();
                  const postModel = require('../models/postModel');
                  let post = await postModel.findById(args.post);
                  //let comments = post.comments;
                  post.comments.push(newComment.id);
                  post.save();
                  return newComment;
              } catch (e) {
                  return new Error(e.message);
              }
          }
      },
      deleteComment: {
        type: commentType,
        description: "Delete a comment by id",
        args: {
            id: { type : new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (parent, args, { req, res }) => {
            const userSpecific = true;
            try {
                await authController.checkAuthentication(req, res, args, userSpecific);
                await comment.findByIdAndDelete(args.id);
            } catch (e) {
                throw new Error(e.message);
            }
        }
      },
      addUserToTopic: {
          type: userType,
          description: "Add user to a Topic",
          args: {
            user: {type: GraphQLID },
            topic: {type: GraphQLID }
          },
          resolve: async (parent, args) => {
              try {
                  const userModel = require('../models/userModel');
                  let user = await userModel.findById(args.user);
                  user.topics.push(args.topic);
                  user.save();
                  return user;
                } catch (e) {
                    return new Error(e.message);
                }
          }
      },
    }
  })

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
  });

