import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);


const Home = () => {
    const [start_date, set_start_date] = useState('');
    const [end_date, set_end_date] = useState('');
    const [articles, set_articles] = useState([]);
    const [tags, set_tags] = useState({});
    const [top_ten_tags, set_top_ten_tags] = useState([]);
    const [selectedTag, set_selectedTag] = useState(null);
    const [tagData, set_tagData] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/articles/getArticles',
                { start_date, end_date },
                { withCredentials: true }
            );

            // Pobranie artykułów z cache
            const response = await axios.get('http://localhost:8080/api/articles/topArticles',
                { withCredentials: true }
            );
            set_articles(response.data);

            // Pobranie najpopularniejszych tagów z cache
            const tagsResponse = await axios.get('http://localhost:8080/api/articles/topTags',
                { withCredentials: true }
            );
            const tagsData = tagsResponse.data;
            set_tags(tagsData);

            // Tworzenie top 10
            const top10TagsArray = Object.entries(tagsData)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .reduce((acc, [key, value]) => {
                    acc[key] = value;
                    return acc;
                }, {});
            set_top_ten_tags(top10TagsArray);

        } catch (error) {
            console.log(error);
        }
    };

    const handleTagChange = async (selectedOption) => {
        set_selectedTag(selectedOption);
        try {
            const response = await axios.post('http://localhost:8080/api/articles/googleData', {
                start_date,
                end_date,
                keyword: selectedOption.value
            }, { withCredentials: true });

            console.log('Google Data Response:', response.data);

            const timelineData = response.data.default.timelineData;

            // Utwórz tablice dla osi X i osi Y
            const xAxis = timelineData.map(entry => entry.formattedTime);
            const yAxis = timelineData.map(entry => entry.value[0]);

            // Wyświetl wyniki w konsoli
            console.log('X Axis:', xAxis);
            console.log('Y Axis:', yAxis);

            const chartData = {
                labels: xAxis,
                datasets: [
                    {
                        label: 'Value over Time',
                        data: yAxis,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false
                    }
                ]
            };
            set_tagData(chartData);

        } catch (error) {
            console.log(error);
        }
    };

    const tagOptions = Object.keys(tags).map(tag => ({
        value: tag,
        label: tag
    }));

    return (
        <div>
            <h1>Wyszukaj trendy z danego okresu</h1>
            <form method="POST" onSubmit={handleSearch}>
                <table>
                    <tbody>
                    <tr>
                        <td>
                            <label htmlFor="start_date"> Wpisz datę początkową</label>
                        </td>
                        <td>
                            <input
                                type="date"
                                id="start_date"
                                name="start_date"
                                value={start_date}
                                onChange={(e) => set_start_date(e.target.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="end_date"> Wpisz datę końcową</label>
                        </td>
                        <td>
                            <input
                                type="date"
                                id="end_date"
                                name="end_date"
                                value={end_date}
                                onChange={(e) => set_end_date(e.target.value)}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <button type="submit">Szukaj</button>
            </form>
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
                {Object.keys(top_ten_tags).length > 0 ? (
                    <ul>
                        {Object.entries(top_ten_tags).map(([tag, count], index) => (
                            <li key={index}>{tag}: {count}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No tags found.</p>
                )}
                <h2>Select Tag to Display Trend</h2>
                <Select
                    options={tagOptions}
                    onChange={handleTagChange}
                    value={selectedTag}
                    placeholder="Select a tag..."
                />
                {tagData && (
                    <div>
                        <h3>{selectedTag.label} Trend Over Time</h3>
                        <Line data={tagData} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
