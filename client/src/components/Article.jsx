import Stack from 'react-bootstrap/Stack';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
export const Article = ({article, article_id}) => {
    const navigate = useNavigate();
    const id = article.id;
    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            await axios.delete('http://localhost:8080/api/user_articles/delete_article', {data: {id: id}, withCredentials: true});
            window.location.reload();
        }
        catch(err){
            console.log(err);
        }
    }

    const handleUpdate = async (e) => {
        navigate('/update_article', {state: {id: id}});
    }

    return(
        <Stack className="border border-3 border-dark rounded p-3" gap={2}>
            <h4 className="text-center "> Tytuł</h4>
            <div className="text-center">{article.title}</div>
            <h4 className="text-center "> Treść</h4>
            <div className="text-center">{article.description}</div>
            <h4 className="text-center "> Kategoria </h4>
            <div className="text-center mb-2">{article.category}</div>
            <Stack  className="justify-content-center" direction="horizontal" gap={2}>
                <button onClick={handleUpdate} className="btn btn-warning btn-lg btn-block"> Edytuj </button>
                <button onClick={handleDelete} className="btn btn-danger btn-lg btn-block"> Usuń </button>
            </Stack>
        </Stack>
    )
}
