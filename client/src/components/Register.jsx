import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [date_of_birth, setDate_of_birth] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            const response = await axios.post('http://localhost:8080/api/users/register',
                { name, surname, date_of_birth, email, password },
                { withCredentials: true }
            );

            navigate('/login');

        }catch (err){
            setError(err.response.data.message || "Błąd serwera")
        }
    }

    return (
        <div>
            <h1> Wprowadź dane </h1>
            <form onSubmit={handleSubmit}>
                <table>
                    <tr>
                        <td>Podaj imię</td>
                        <td>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                                   placeholder="Imię"/>
                        </td>
                    </tr>

                    <tr>
                        <td>Podaj nazwisko</td>
                        <td>
                            <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} required
                                   placeholder="Nazwisko"/>
                        </td>
                    </tr>

                    <tr>
                        <td>Podaj rok urodzenia</td>
                        <td>
                            <input type="number" value={date_of_birth}
                                   onChange={(e) => setDate_of_birth(e.target.value)}
                                   required placeholder="Rok urodzenia"/>
                        </td>
                    </tr>

                    <tr>
                        <td>Podaj email</td>
                        <td>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                   placeholder='Email'/>
                        </td>
                    </tr>

                    <tr>
                        <td>Podaj haslo</td>
                        <td>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                   required
                                   placeholder='Password'/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <button type="submit"> Zarejestruj się </button>
                        </td>
                    </tr>
                </table>

            </form>
            {error && <p>{error}</p>}
        </div>
    )
}

export default Register;
