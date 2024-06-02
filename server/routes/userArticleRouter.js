const userArticleController = require('../controllers/userArticleController');
const userController = require('../controllers/userController');
const express = require("express");
const userArticleRouter = express.Router();

userArticleRouter.post('/create', userArticleController.addArticle);
userArticleRouter.get('/get_articles', userArticleController.getUserArticles)
userArticleRouter.delete('/delete_article', userArticleController.deleteArticle);
userArticleRouter.post('/update_article', userArticleController.updateArticle);
module.exports = userArticleRouter;