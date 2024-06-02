import React from "react";
import axios from "axios";
import {Link} from "react-router-dom";

const NavigationBar = () => {
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/api/users/logout', {}, { withCredentials: true });
            window.location.reload();
        } catch (err) {
            console.log(`Błąd podczas wylogowywania: ${err}`);
        }
    };
    return (
        <nav className="navbar navbar-light mt-3 rounded p-3" style={{backgroundColor: '#e3f2fd'}}>
            <button onClick={handleLogout} className="btn btn-outline-danger">Wyloguj</button>

            <Link to="/home">
                <button className="btn btn-secondary" type="button"> Strona główna </button>
            </Link>

            <Link to="/create_article">
                <button className="btn btn-success" type="button"> Dodaj artykuł </button>
            </Link>

            <Link to="/your_articles">
                <button className="btn btn-info text-white" type="button"> Twoje artykuły </button>
            </Link>
        </nav>

    );
}

export default NavigationBar;