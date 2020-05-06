// User routes

'use strict';

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const path = require('path');

router.post('/addPost', postController.create_post);




module.exports = router;