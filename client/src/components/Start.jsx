import React from 'react';
import { Link } from 'react-router-dom';
const Start = () => {
    return (
        <div class="d-flex justify-content-center align-items-center min-vh-100">
            <div>
                <Link to="/login">
                    <button class="btn btn-primary btn-lg mx-2">Logowanie</button>
                </Link>
            </div>
            <div>
                <Link to="/register">
                    <button class="btn btn-outline-primary btn-lg mx-2" >Rejestracja</button>
                </Link>
            </div>

        </div>
    );
};

export default Start