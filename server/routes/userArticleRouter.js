const userArticleController = require('../controllers/userArticleController');
const userController = require('../controllers/userController');
const express = require("express");
const userArticleRouter = express.Router();

userArticleRouter.post('/create', userController.tokenValidation, userArticleController.addArticle);
userArticleRouter.get('/get_articles', userController.tokenValidation, userArticleController.getUserArticles)
userArticleRouter.delete('/delete_article', userController.tokenValidation, userArticleController.deleteArticle);
module.exports = userArticleRouter;