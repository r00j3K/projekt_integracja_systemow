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
    const [selectedTag, set_selectedTag] = useState({
        value: "",
        label: ""
    });
    const [tagData, set_tagData] = useState(null);
    const [selected_tag_err, set_selected_tag_err] = useState("")
    const [article_err, set_article_err] = useState("")

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
            if (response.data.length === 0) {
                set_article_err("Brak danych")
                set_articles([])
                set_top_ten_tags([])
                set_selectedTag({ label: "", value: "" })
                set_tagData(null)
            }
            else {
                set_article_err("")
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
            }
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

            console.log('Google Data Response:', response);
            if (response.data.default) {
                const timelineData = response.data.default.timelineData;
                // Utwórz tablice dla osi X i osi Y

                if (timelineData.length === 0) {
                    set_tagData(null)
                    set_selected_tag_err("Brak wystarczających informacji lub inny błąd");
                }
                else {
                    set_selected_tag_err("");
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
                    console.log(`Przed przypisaniem do tagData: ${chartData}`)
                    set_tagData(chartData);
                    console.log("Zmiana tagow: ", tagData);
                }
            }
            else {
                set_tagData(null)
                set_selected_tag_err("Wystąpił błąd podczas pobierania danych");
            }

        } catch (error) {
            console.log(error);
        }
    };

    const tagOptions = Object.keys(tags).map(tag => ({
        value: tag,
        label: tag
    }));

    const handleDownload = async (e) => {
        e.preventDefault();
        try {
            console.log(articles);
            await axios.post("http://localhost:8080/api/articles/download", {
                articles_data: articles
            }, { withCredentials: true });
        }
        catch(err)
        {
            console.log(err);
        }
        
    }

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

            {articles.length > 0 && article_err === "" ? (
                <div>
                    <h2>Articles</h2>
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
                    <button onClick={handleDownload}> Pobierz dane artykułów </button>
                </div>
            ) : (
                <h2> {article_err} </h2>
            )}
            {Object.keys(top_ten_tags).length > 0 ? (
                <div>
                    <h2>Top Tagi</h2>
                    <ul>
                        {Object.entries(top_ten_tags).map(([tag, count], index) => (
                            <li key={index}>{tag}: {count}</li>
                        ))}
                    </ul>

                    <h2>Sprawdź trend wybranego tagu na świecie</h2>
                    <Select
                        options={tagOptions}
                        onChange={handleTagChange}
                        value={selectedTag}
                        placeholder="Wybierz tag..."
                    />
                </div>
            ) : (
                <p></p>
            )}

            {(tagData !== null) ? (
                <div>
                    <h3>Trend dla tagu {selectedTag.value} w zadanym okresie</h3>
                    <Line data={tagData} />
                </div>
            ) : (
                <h2>{selected_tag_err}</h2>
            )}

        </div>
    );
};

export default Home;
