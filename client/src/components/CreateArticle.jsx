import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateArticle = () => {
    const categories = [
        { value: "świat", label: "Świat" },
        { value: "polska", label: "Polska" },
        { value: "polityka", label: "Polityka" },
        { value: "medycyna", label: "Medycyna" },
        { value: "przestepstwa", label: "Przestepstwa" },
        { value: "żywienie", label: "Żywienie" },
        { value: "sport", label: "Sport" }
    ];

    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState({ value: '', label: 'Wybierz kategorie...' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/user_articles/create', { title, description, category }, { withCredentials: true });
            console.log(response);
            setError('');
            // Transition to the user's articles page
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Utwórz artykuł</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group row mb-3">
                    <label htmlFor="title" className="col-sm-2 col-form-label">Tytuł</label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-group row mb-3">
                    <label htmlFor="description" className="col-sm-2 col-form-label">Opis</label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            className="form-control"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-group row mb-3">
                    <label htmlFor="category" className="col-sm-2 col-form-label">Kategoria</label>
                    <div className="col-sm-10">
                        <Select
                            options={categories}
                            name="category"
                            value={category}
                            onChange={(selectedOption) => setCategory(selectedOption)}
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">Utwórz</button>
            </form>
            {error && <div className="alert alert-danger text-center mt-3">{error}</div>}
        </div>
    );
};

export default CreateArticle;
