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


        </nav>

    );
}

export default NavigationBar;