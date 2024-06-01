const userArticleController = require('../controllers/userArticleController');
const userController = require('../controllers/userController');
const express = require("express");
const userArticleRouter = express.Router();

userArticleRouter.post('/create', userController.tokenValidation, userArticleController.addArticle);

module.exports = userArticleRouter;