const axios = require('axios');
const googleTrends = require('google-trends-api');
const Article = require('../models/articleModel');
const {Op} = require("sequelize");

let cachedResults = {
    topArticles: null,
    tagsPopularity: null,
    googleTrends: null,
    top10Tags: null
}

async function getArticles(req, res) {

    const config = {
        headers: {
            //zmien bearer z sztywnego na ten z cookis
            Authorization: `Bearer `+req.cookies.wykopToken
        }
    };
    let startDate = new Date(req.body.start_date);
    let tempstartDate = new Date(startDate);

    const endDate = new Date(req.body.end_date);

    let tempendDate = new Date(endDate);

    let counter = 0

    let allArticles = [];

    try {
        //pobranie wszystkich artykułów w obrębie podanych miesięcy
        while (startDate <= endDate) {
            const tempYear = startDate.getFullYear();
            const tempMonth = startDate.getMonth() + 1;
            const response = await axios.get(`https://wykop.pl/api/v3/hits/links?year=${tempYear}&month=${tempMonth}&sort=all&limit=50`, config);

            //wyfiltrowanie artykułów, których dzień publikacji mieści się w zadanym okresie
            const filteredArticles = response.data.data.filter(article => {
                const articleDate = new Date(article.created_at);
                return articleDate >= startDate && articleDate <= endDate;
                //zapisanie niezbędnych informacji o każdym pobranym artykule spełniającym wymagania
            }).map(link => ({
                id: link.id,
                description: link.description,
                title: link.title,
                created_at: link.created_at,
                tags: link.tags,
                votes: link.votes.count
            }));

            //pobranie 50 pierwszych artykułów z każdego miesiąca
            allArticles = allArticles.concat(filteredArticles.slice(0, 50));

            //zwiększenie miesiąca o 1
            startDate.setMonth(tempMonth);

            //counter += 1
        }



        //wyekstrahowanie 10 najbardziej popularnych artykułów z podanego okresu
        const topArticles = allArticles.sort((a, b) => b.votes - a.votes).slice(0,10);

        const tagsPopularity = {};

        // tablica tagów
        topArticles.forEach(article => {
            article.tags.forEach(tag => {
                if (tagsPopularity[tag]) {
                    tagsPopularity[tag] += 1;
                } else {
                    tagsPopularity[tag] = 1;
                }
            });
        });

        // Zamiana tagsPopularity na tablicę, posortowanie i wybranie 10 najpopularniejszych tagów
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

        //zapisywanie danych do bazy
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

        res.send(topArticles)



        //cachedResults.googleTrends = tagsInterestOverWorld

        //console.log(tagsInterestOverWorld)

        //const popularTags = Object.keys(tagsArr).filter(tag => tagsArr[tag] > 1);

        //console.log(popularTags)

        //res.send(tagsInterestOverWorld)

    } catch (error) {
        res.send("Błąd podczas pobierania danych: " + error.message);
    }
}

//wykorzystanie funkcji getArticles do pobrania osobno tagow i articles,

async function topArticles(req, res) {
    try {
        const topArticles = cachedResults.topArticles
        res.send(topArticles);
    } catch (error) {
        res.send("Błąd podczas przetwarzania danych: " + error.message);
    }
}

async function top10Tags(req, res) {
    try {
        const top10tags = cachedResults.top10Tags
         res.send(top10tags);
    }
    catch (e){
        console.log(e);
    }


}

async function topTags(req, res) {
    try {
        const topTags = cachedResults.tagsPopularity
        res.send(topTags);
    } catch (error) {
        res.send("Błąd podczas przetwarzania danych: " + error.message);
    }
}

async function googleData(req, res) {

    let startDate = new Date(req.body.start_date);
    let endDate = new Date(req.body.end_date);
    let tempstartDate = new Date(startDate);
    let tempendDate = new Date(endDate);

    let keyword = req.body.keyword;

    cachedResults.googleTrends = await googleTrends.interestOverTime({keyword: keyword  , startTime: tempstartDate, endTime: tempendDate})
    console.log(cachedResults.googleTrends);
    res.send(cachedResults.googleTrends)

}

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
        }))

        //nagłówek informuje przeglądarkę, że odpowiedź powinna być traktowana jako załącznik, co powoduje, że przeglądarka wyświetli okno dialogowe pobierania pliku
        res.setHeader('Content-Disposition', 'attachment; filename=exportedArticles.json');

        //Ten nagłówek określa typ zawartości odpowiedzi, application/json: Informuje, że zawartość odpowiedzi jest w formacie JSON.
        res.setHeader('Content-Type', 'application/json');

        res.send(JSON.stringify(articlesData, null, 2));

    } catch (error) {
        res.status(500).send("Blad: " + error.message);
    }
}

module.exports = {
    getArticles,
    topArticles,
    top10Tags,
    topTags,
    exportData,
    googleData
};
