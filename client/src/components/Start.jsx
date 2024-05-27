import React from 'react';
import { Link } from 'react-router-dom';
const Start = () => {
    return (
        <div>
            <Link to="/login">
                <button>Log In</button>
            </Link>
            <Link to="/register">
                <button>Register</button>
            </Link>
        </div>
    );
};

export default Start