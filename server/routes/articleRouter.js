const articleController = require('../controllers/articleController');
const userController = require('../controllers/userController');
const express = require("express");
const articleRouter = express.Router();

articleRouter.post('/getArticles', articleController.getArticles);
articleRouter.get('/topTags' ,articleController.topTags);
articleRouter.get('/topArticles' ,articleController.topArticles);
articleRouter.post('/export', userController.downloadVerification, articleController.exportData);
articleRouter.post('/googleData',articleController.googleData);
articleRouter.get('/top10Tags', articleController.top10Tags);
//articleRouter.post('/download', articleController.downloadData);
module.exports = articleRouter