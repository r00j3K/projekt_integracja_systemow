const axios = require('axios');
const userArticle = require('../models/userArticleModel');

async function addArticle(req,res){
    try {
        const {title, description, category} = req.body;
        console.log(title, description, category);
        if( title.length === 0 || description.length === 0 ) {
            res.send({message: "Pole tytuł oraz opis muszą zostać wypełnione!"})
        }
        const article = await userArticle.create({title: title, description: description, category: category, user_id: req.cookies.id});
        console.log('Dodano artykul '+article);
        res.send(article);
    }
    catch(err){
        res.send({message: err})
    }
}

module.exports = {
    addArticle
}