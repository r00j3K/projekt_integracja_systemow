import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {Link, useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from "react-bootstrap";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/users/login',
                { email, password },
                { withCredentials: true } // Dodanie withCredentials
            );

            //ciasteczka z tokenami ustawiamy na serwerze
            //Cookies.set('jwt', response.data.jwt, { expires: 1 });
            //Cookies.set('wykopToken', response.data.wykopToken, { expires: 1 });
            window.location.reload();
        } catch (err){
            setError(err.response.data.message);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="col-md-6">
                <h2 className="text-center mb-4">Logowanie</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-outline mb-4">
                        <input
                            id="form2Example1"
                            className="form-control"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label className="form-label" htmlFor="form2Example1">Adres e-mail</label>
                    </div>

                    <div className="form-outline mb-4">
                        <input
                            type="password"
                            id="form2Example2"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label className="form-label" htmlFor="form2Example2">Hasło</label>
                    </div>
                    <div className="text-center">
                        <Button type="submit" variant="primary" className="mx-2 my-2">Zaloguj się</Button>
                        <Link to="/register">
                            <Button variant="secondary">Rejestracja</Button>
                        </Link>
                    </div>
                </form>
                {error && <div className="alert alert-danger text-center" role="alert">{error}</div>}
            </div>
        </div>
    );
};

export default Login;
