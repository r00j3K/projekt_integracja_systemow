import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

const Home = () => {
    const [start_date, set_start_date] = useState('');
    const [end_date, set_end_date] = useState('');
    const [articles, set_articles] = useState([]);
    const [tags, set_tags] = useState({});
    const [top_ten_tags, set_top_ten_tags] = useState([]);
    const [selectedTag, set_selectedTag] = useState(null);
    const [tagData, set_tagData] = useState(null);
    const [selected_tag_err, set_selected_tag_err] = useState("");
    const [article_err, set_article_err] = useState("");
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/articles/getArticles', { start_date, end_date }, { withCredentials: true });
            if (response.data.length === 0) {
                set_article_err("Brak danych");
                set_articles([]);
                set_tags({});
                set_top_ten_tags([]);
                set_selectedTag(null);
                set_tagData(null);
            } else {
                set_article_err("");
                set_articles(response.data);
                fetchTopTags();
            }
        } catch (error) {
            await handleLogout();
        }
    };

    const fetchTopTags = async () => {
        try {
            const tagsResponse = await axios.get('http://localhost:8080/api/articles/topTags', { withCredentials: true });
            const tagsData = tagsResponse.data;
            set_tags(tagsData);

            const top10TagsArray = Object.entries(tagsData)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .reduce((acc, [key, value]) => {
                    acc[key] = value;
                    return acc;
                }, {});
            set_top_ten_tags(top10TagsArray);
        } catch (error) {
            await handleLogout();
        }
    };

    const handleTagChange = async (selectedOption) => {
        set_selectedTag(selectedOption);

        try {
            const response = await axios.post('http://localhost:8080/api/articles/googleData', { start_date, end_date, keyword: selectedOption.value }, { withCredentials: true });

            if (response.data.default) {
                const timelineData = response.data.default.timelineData;
                if (timelineData.length === 0) {
                    set_tagData(null);
                    set_selected_tag_err("Brak wystarczających informacji lub inny błąd");
                } else {
                    set_selected_tag_err("");
                    const xAxis = timelineData.map(entry => entry.formattedTime);
                    const yAxis = timelineData.map(entry => entry.value[0]);

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
                }
            } else {
                set_tagData(null);
                set_selected_tag_err("Wystąpił błąd podczas pobierania danych");
            }
        } catch (error) {
            await handleLogout();
        }
    };

    const tagOptions = Object.keys(tags).map(tag => ({
        value: tag,
        label: tag
    }));

    const handleDownload = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/articles/export", { start_date, end_date }, { withCredentials: true, responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'articles.json');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            await handleLogout();
        }

    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/api/users/logout', {}, { withCredentials: true });
            window.location.reload();
        } catch (err) {
            console.log(`Błąd podczas wylogowywania: ${err}`);
        }
    };

    return (
        <div className="container-fluid">
            <nav className="navbar navbar-light" style={{ backgroundColor: '#e3f2fd' }}>
                <button onClick={handleLogout} className="btn btn-outline-danger">Wyloguj</button>
            </nav>

            <h1 className="text-center my-4">Wyszukaj trendy z danego okresu</h1>
            <form method="POST" onSubmit={handleSearch} className="mb-4 p-3 border rounded">
                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="start_date" className="form-label fw-bold">Wpisz datę początkową</label>
                        <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            className="form-control form-control-sm"
                            value={start_date}
                            onChange={(e) => set_start_date(e.target.value)}
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="end_date" className="form-label fw-bold">Wpisz datę końcową</label>
                        <input
                            type="date"
                            id="end_date"
                            name="end_date"
                            className="form-control form-control-sm"
                            value={end_date}
                            onChange={(e) => set_end_date(e.target.value)}
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">Szukaj</button>
            </form>

            <div className="row">
                <div className="col-md-6">
                    {articles.length > 0 && article_err === "" ? (
                        <div className="border rounded p-3">
                            <h2>Articles</h2>
                            <ul className="list-group">
                                {articles.map((article, index) => (
                                    <li key={index} className="list-group-item">
                                        <h3>{article.title}</h3>
                                        <p>{article.description}</p>
                                        <p><strong>Tags:</strong> {article.tags.join(', ')}</p>
                                        <p><strong>Votes:</strong> {article.votes}</p>
                                        <p><strong>Created at:</strong> {new Date(article.created_at).toLocaleDateString()}</p>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={handleDownload} className="btn btn-secondary my-5">Pobierz dane artykułów</button>
                        </div>
                    ) : (
                        <h2>{article_err}</h2>
                    )}
                </div>

                <div className="col-md-6">
                    {Object.keys(top_ten_tags).length > 0 ? (
                        <div className="border rounded p-3">
                            <h2>Top Tagi</h2>
                            <ul className="list-group">
                                {Object.entries(top_ten_tags).map(([tag, count], index) => (
                                    <li key={index} className="list-group-item">{tag}: {count}</li>
                                ))}
                            </ul>

                            <div className="border rounded p-3 mt-4">
                                <h2>Sprawdź trend wybranego tagu na świecie</h2>
                                <Select
                                    options={tagOptions}
                                    onChange={handleTagChange}
                                    value={selectedTag}
                                    placeholder="Wybierz tag..."
                                    className="mb-4"
                                />

                                {tagData !== null ? (
                                    <div>
                                        <h3>Trend dla tagu {selectedTag?.value} w zadanym okresie</h3>
                                        <Line data={tagData} />
                                    </div>
                                ) : (
                                    <h2>{selected_tag_err}</h2>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
