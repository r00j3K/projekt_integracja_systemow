const articleController = require('../controllers/articleController');
const userController = require('../controllers/userController');

const express = require("express");
const articleRouter = express.Router();

articleRouter.post('/getArticles', userController.tokenValidation ,articleController.getArticles)
articleRouter.get('/topTags', userController.tokenValidation ,articleController.topTags)
articleRouter.get('/topArticles', userController.tokenValidation ,articleController.topArticles)
articleRouter.post('/export', articleController.exportData);
articleRouter.post('/googleData',articleController.googleData)
articleRouter.get('/top10Tags', userController.tokenValidation ,articleController.top10Tags)
module.exports = articleRouter