import React from 'react';
import { Link } from 'react-router-dom';
const Start = () => {
    return (
        <div class="d-flex justify-content-center align-items-center min-vh-100">
            <div class="row">
                <Link to="/login">
                    <button class="btn btn-primary">Logowanie</button>
                </Link>
            </div>
            <div class="row">
                <Link to="/register">
                    <button class="btn btn-outline-primary" >Rejestracja</button>
                </Link>
            </div>

        </div>
    );
};

export default Start