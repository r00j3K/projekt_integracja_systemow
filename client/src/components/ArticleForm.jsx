import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useNavigate} from "react-router-dom";

const ArticleForm = ({article_id,handleSubmit,title,setTitle,description,setDescription,category,setCategory,error,setError}) => {

    const categories = [
        { value: "świat", label: "Świat" },
        { value: "polska", label: "Polska" },
        { value: "polityka", label: "Polityka" },
        { value: "medycyna", label: "Medycyna" },
        { value: "przestepstwa", label: "Przestepstwa" },
        { value: "żywienie", label: "Żywienie" },
        { value: "sport", label: "Sport" }
    ];

    return (
        <div className="container mt-5">
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

export default ArticleForm;
