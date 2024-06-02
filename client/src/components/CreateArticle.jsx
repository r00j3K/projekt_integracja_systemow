import axios from "axios";
import ArticleForm from "./ArticleForm";
import NavigationBar from "./NavigationBar";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {handleLogout} from "./scripts/logout";

const CreateArticle = () => {
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState({ value: '', label: 'Wybierz kategorie...' });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("tworzenie");
            const response = await axios.post('http://localhost:8080/api/user_articles/create', { title, description, category }, { withCredentials: true });
            console.log(response);
            setError('');
            navigate('/your_articles');
        } catch (err) {
            if (err.response && err.response.status === 401) {
                handleLogout();
            } else {
                setError(err.response.data.message);
            }
        }
    };
    return (
        <div>
            <NavigationBar />
            <h1 className="mb-4 text-center  my-4">Utwórz artykuł</h1>
            <ArticleForm
                article_id={-1}
                handleSubmit={handleSubmit}
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                category={category}
                setCategory={setCategory}
                error={error}
                setError={setError}
            />;
        </div>
    )
}

export default CreateArticle;