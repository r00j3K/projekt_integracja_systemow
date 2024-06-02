const { Transaction } = require('sequelize');
const axios = require('axios');
const userArticle = require('../models/userArticleModel');
const db = require('../db'); // Assuming db is your Sequelize instance

async function addArticle(req, res) {
    const t = await db.transaction();
    try {
        const { title, description, category } = req.body;
        console.log("title: " + title + " desc: " + description + " cat:" + category);
        console.log("Dlugosc: " + title.length);
        const id = req.cookies.id;
        console.log("Id " + id);
        console.log(title, description, category);
        if (title.length === 0 || description.length === 0 || category.value === '') {
            console.log("Walidacja nie przeszla");
            return res.status(400).send({ message: "Wszystkie pola muszą zostać wypełnione!" });
        }
        const article = await userArticle.create(
            { title: title, description: description, category: category.value, user_id: id },
            { transaction: t }
        );
        console.log('Dodano artykul ' + article);
        await t.commit();
        res.send(article);
    } catch (err) {
        await t.rollback();
        res.send({ message: err });
    }
}

async function getUserArticles(req, res) {
    try {
        const data = await userArticle.findAll({ where: { user_id: req.cookies.id } });

        //utworzenie tablicy z obiektu przesłanego w resposnie
        // const articles = Object.keys(data).map((key) => {
        //     return data[key];
        // });

        res.send(data);
    } catch (err) {
        res.send({ message: err });
    }
}

async function deleteArticle(req, res) {
    const t = await db.transaction();
    try {
        const result = await userArticle.destroy({ where: { id: req.body.id }, transaction: t });
        await t.commit();
        res.end();
    } catch (err) {
        await t.rollback();
        res.send({ message: err });
    }
}

async function getOneArticle(req, res) {
    try {
        const data = await userArticle.findOne({ where: { id: req.body.article_id } });
        res.send(data);
    } catch (err) {
        res.send({ message: err });
    }
}

async function updateArticle(req, res) {
    const t = await db.transaction();
    try {
        const { article_id, title, description, category } = req.body;
        console.log("ID: " + article_id);
        console.log("Title: " + title);
        console.log("Description: " + description);
        console.log("Category: " + category);
        if (title.length === 0 || description.length === 0 || category.value === '') {
            return res.status(400).send({ message: "Wszystkie pola muszą zostać wypełnione!" });
        }
        const response = await userArticle.update(
            { title: title, description: description, category: category.value },
            {
                where: { id: article_id },
                transaction: t
            }
        );
        console.log("odpowiedz");
        console.log(response);
        await t.commit();
        res.end();
    } catch (err) {
        await t.rollback();
        res.send({ message: err });
    }
}

module.exports = {
    updateArticle,
    addArticle,
    getUserArticles,
    deleteArticle,
    getOneArticle
};
