import React, { useState, useEffect } from 'react';
import { Articles } from './Articles';
import axios from 'axios';
import NavigationBar from "./NavigationBar";

const UserArticles = () => {
    const [userArticles, setUserArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/user_articles/get_articles', {withCredentials: true});
                setUserArticles(response.data);
                console.log(userArticles);
            } catch (err) {
                setError('Błąd przy pobieraniu artykułów');
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return <div>Pobieranie artykułów...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container-fluid w-75">
            <NavigationBar/>
            <h1 className="text-center mt-5 mb-5">Twoje artykuły</h1>
            {userArticles.length > 0 ? (
                <Articles articles={userArticles} />
            ) : (
                <h2 className="text-center text-danger">Brak artykułów</h2>
            )}
        </div>
    );
};

export default UserArticles;