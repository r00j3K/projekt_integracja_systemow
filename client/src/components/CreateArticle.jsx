import {react, useState} from 'react';
import axios from 'axios';
import Select from 'react-select';


const CreateArticle = () => {
    const categories = [
        {value: "świat",label: "Świat"},
        {value: "polska", label: "Polska"},
        {value: "polityka", label: "Polityka"},
        {value: "medycyna", label: "Medycyna"},
        {value: "przestepstwa", label: "Przestepstwa"},
        {value: "żywienie", label: "Żywienie"},
        {value: "sport", label: "Sport"}
    ]
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState({value: '', label:'Wybierz kategorie...'});
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/user_articles/create', {title, description, category}, { withCredentials: true })
            console.log(response);
        }
        catch(err){
            console.log(`Error ${err.message}`)
        }
    }
    return (
        <div>
            <h1> Utwórz artykuł </h1>
            <form onSubmit={handleSubmit}>
                <table>
                    <tr>
                        <td>
                            <label for="title"> Tytuł </label>
                        </td>
                        <td>
                            <input type="text"
                                   name="title"
                                   value={title}
                                   onChange={(e) => setTitle(e.target.value)}
                            />
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <label for="description"> Opis </label>
                        </td>
                        <td>
                            <input type="text"
                                   name="description"
                                   value={description}
                                   onChange={(e) => setDescription(e.target.value)} />
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <label htmlFor="category"> Kategoria </label>
                        </td>
                        <td>
                            <Select options={categories}
                                    name="category"
                                    value={category}
                                    onChange={(selectedOption) => setCategory(selectedOption)}
                            ></Select>
                        </td>
                    </tr>
                </table>
                <button onClick={handleSubmit} className="btn btn-primary"> Utwórz </button>
            </form>
        </div>
    );
}

export default CreateArticle;