import {useLocation} from "react-router-dom";
import {useState, useEffect} from "react";
import NavigationBar from "./NavigationBar";
import ArticleForm from "./ArticleForm";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const UpdateArticle = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const article_id = location.state.id;

    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState({ value: '', label: 'Wybierz kategorie...' });

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.post(`http://localhost:8080/api/user_articles/get_one`, {article_id}, { withCredentials: true });
                const article = response.data;

                setTitle(article.title);
                setDescription(article.description);
                setCategory({ value: article.category, label: article.category });
            } catch (err) {
                setError('Failed to fetch article details');
            }
        };

        fetchArticle();
    }, [article_id]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/user_articles/update_article', {article_id, title, description, category}, {withCredentials: true });
            navigate('/your_articles');
        }
        catch (err) {
            setError(err.response.data.message);
        }
    }



    return (
        <div>
            <NavigationBar/>
            <h1 className="mb-4 text-center  my-4">Edytuj artykuł</h1>
            <ArticleForm
                article_id={article_id}
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

    );
}

export default UpdateArticle;