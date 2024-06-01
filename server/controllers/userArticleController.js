const axios = require('axios');
const userArticle = require('../models/userArticleModel');

async function addArticle(req,res){
    try {
        const {title, description, category} = req.body;
        console.log("title: "+title+" desc: "+description +" cat:"+category);
        console.log("Dlugosc: "+title.length)
        const id = req.cookies.id;
        console.log("Id "+id);
        console.log(title, description, category);
        if( title.length === 0 || description.length === 0 || category.value === '') {
            console.log("Walidacja nie przeszla")
            return res.status(400).send({message:"Wszystkie pola muszą zostać wypełnione!"});
        }
        const article = await userArticle.create({title: title, description: description, category: category.value, user_id: req.cookies.id});
        console.log('Dodano artykul '+article);
        res.send(article);
    }
    catch(err){
        res.send({message: err})
    }
}

async function getUserArticles(req,res){
    try{
        const data = UserArticles.findAll({where: {user_id: req.cookies.id}});
        console.log(data);
    }
    catch(err){
        res.send({message: err})
    }
}

module.exports = {
    addArticle
}