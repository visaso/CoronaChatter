// User routes

'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/all', userController.user_list_get);

module.exports = router;