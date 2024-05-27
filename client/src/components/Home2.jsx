import React, { useState } from 'react';
import axios from 'axios';

const Home2 = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [articles, setArticles] = useState([]);
    const [tags, setTags] = useState([]);

    const handleSearch = async () => {
        try {
            await axios.post('http://localhost:8080/api/articles/getArticles', {
                start_date: startDate,
                end_date: endDate
            });

            // Pobranie artykułów z cache
            const response = await axios.get('http://localhost:8080/api/articles/topArticles');
            setArticles(response.data);

            // Pobranie najpopularniejszych tagów z cache
            const tagsResponse = await axios.get('http://localhost:8080/api/articles/topTags');
            setTags(tagsResponse.data);

        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ marginRight: '20px' }}>
                <h2>Search Articles</h2>
                <label>
                    Start Date:
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    End Date:
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </label>
                <br />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div>
                <h2>Articles</h2>
                {articles.length > 0 ? (
                    <ul>
                        {articles.map((article, index) => (
                            <li key={index}>
                                <h3>{article.title}</h3>
                                <p>{article.description}</p>
                                <p><strong>Tags:</strong> {article.tags.join(', ')}</p>
                                <p><strong>Votes:</strong> {article.votes}</p>
                                <p><strong>Created at:</strong> {new Date(article.created_at).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No articles found.</p>
                )}
                <h2>Top Tags</h2>
                {tags && Object.keys(tags).length > 0 ? (
                    <ul>
                        {Object.keys(tags).map((tag, index) => (
                            <li key={index}>
                                {tag}: {tags[tag]}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No tags found.</p>
                )}
            </div>
        </div>
    );
};

export default Home2;
