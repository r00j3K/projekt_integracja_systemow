const axios = require('axios');
const googleTrends = require('google-trends-api');
const Article = require('../models/articleModel');
const { Op } = require("sequelize");

let cachedResults = {
    topArticles: null,
    tagsPopularity: null,
    googleTrends: null,
    top10Tags: null
}

async function getArticles(req, res) {
    const config = {
        headers: {
            Authorization: `Bearer ` + req.cookies.wykopToken
        }
    };
    let startDate = new Date(req.body.start_date);
    const endDate = new Date(req.body.end_date);
    let allArticles = [];

    try {
        while (startDate <= endDate) {
            const tempYear = startDate.getFullYear();
            const tempMonth = startDate.getMonth() + 1;
            const response = await axios.get(`https://wykop.pl/api/v3/hits/links?year=${tempYear}&month=${tempMonth}&sort=all&limit=50`, config);

            const filteredArticles = response.data.data.filter(article => {
                const articleDate = new Date(article.created_at);
                return articleDate >= startDate && articleDate <= endDate;
            }).map(link => ({
                id: link.id,
                description: link.description,
                title: link.title,
                created_at: link.created_at,
                tags: link.tags,
                votes: link.votes.count
            }));

            allArticles = allArticles.concat(filteredArticles.slice(0, 50));
            startDate.setMonth(tempMonth);
        }

        const topArticles = allArticles.sort((a, b) => b.votes - a.votes).slice(0, 10);
        const tagsPopularity = {};

        topArticles.forEach(article => {
            article.tags.forEach(tag => {
                if (tagsPopularity[tag]) {
                    tagsPopularity[tag] += 1;
                } else {
                    tagsPopularity[tag] = 1;
                }
            });
        });

        const top10TagsArray = Object.entries(tagsPopularity)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});

        cachedResults.topArticles = topArticles;
        cachedResults.tagsPopularity = tagsPopularity;
        cachedResults.top10Tags = top10TagsArray;

        for (const article of topArticles) {
            await Article.findOrCreate({
                where: { id: article.id },
                defaults: {
                    id: article.id,
                    description: article.description,
                    title: article.title,
                    created_at: article.created_at,
                    tags: article.tags,
                    votes: article.votes
                }
            })
        }

        res.send(topArticles);
    } catch (error) {
        res.send("Błąd podczas pobierania danych: " + error.message);
    }
}

async function topArticles(req, res) {
    try {
        const topArticles = cachedResults.topArticles;
        res.send(topArticles);
    } catch (error) {
        res.send("Błąd podczas przetwarzania danych: " + error.message);
    }
}

async function top10Tags(req, res) {
    try {
        const top10tags = cachedResults.top10Tags;
        res.send(top10tags);
    } catch (e) {
        console.log(e);
    }
}

async function topTags(req, res) {
    try {
        const topTags = cachedResults.tagsPopularity;
        res.send(topTags);
    } catch (error) {
        res.send("Błąd podczas przetwarzania danych: " + error.message);
    }
}

async function googleData(req, res) {
    let startDate = new Date(req.body.start_date);
    let endDate = new Date(req.body.end_date);
    let keyword = req.body.keyword;

    try {
        cachedResults.googleTrends = await googleTrends.interestOverTime({ keyword: keyword, startTime: startDate, endTime: endDate });
        console.log(cachedResults.googleTrends);
        res.send(cachedResults.googleTrends);
    } catch (error) {
        res.send("Błąd podczas przetwarzania danych: " + error.message);
    }
}

const fs = require('fs');
const path = require('path');

async function exportData(req, res) {
    try {
        let startDate = new Date(req.body.start_date);
        const endDate = new Date(req.body.end_date);

        const articles = await Article.findAll({
            where: {
                created_at: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        const articlesData = articles.map(article => ({
            id: article.id,
            description: article.description,
            title: article.title,
            created_at: article.created_at,
            tags: article.tags,
            votes: article.votes
        }));

        const filePath = path.join(__dirname, 'articles.json');
        fs.writeFileSync(filePath, JSON.stringify(articlesData, null, 2), 'utf-8');

        res.download(filePath, 'articles.json', (err) => {
            if (err) {
                throw err;
            } else {
                fs.unlinkSync(filePath);//usuwanie po pobraniu
            }
        });

    } catch (error) {
        res.status(500).send("Błąd: " + error.message);
    }
}


async function downloadData(req, res) {
    try {
        const data = req.body.articles_data;
        const filePath = path.join(__dirname, '../articles.json');
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));

        res.download(filePath, 'articles.json');
    } catch (err) {
        console.log(err);
        res.status(500).send("Błąd: " + err.message);
    }
}

module.exports = {
    getArticles,
    topArticles,
    top10Tags,
    topTags,
    exportData,
    googleData,
    downloadData
};
