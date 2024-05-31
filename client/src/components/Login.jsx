import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

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

            navigate('/home');
        } catch (err){
            setError(err.response.data.message || "Błąd serwera")
        }
    };

    return (
        // <div>
        //     <h2>Login</h2>
        //     <form onSubmit={handleSubmit}>
        //         <div>
        //             <label>Email:</label>
        //             <input
        //                 type="email"
        //                 value={email}
        //                 onChange={(e) => setEmail(e.target.value)}
        //                 required
        //             />
        //         </div>
        //         <div>
        //             <label>Password:</label>
        //             <input
        //                 type="password"
        //                 value={password}
        //                 onChange={(e) => setPassword(e.target.value)}
        //                 required
        //             />
        //         </div>
        //         <button type="submit">Login</button>
        //     </form>
        //     {error && <p>{error}</p>}
        // </div>

    <div>
    <form onSubmit={handleSubmit}>
        <div className="form-outline mb-4">
            <input id="form2Example1" className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <label className="form-label" htmlFor="form2Example1">Adres e-mail</label>
        </div>

        <div  className="form-outline mb-4">
            <input type="password" id="form2Example2" className="form-control"
                   value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required/>
            <label className="form-label" htmlFor="form2Example2">Hasło</label>
        </div>


        {/*<div class="row mb-4">*/}
        {/*    <div class="col d-flex justify-content-center">*/}

        {/*        <div class="form-check">*/}
        {/*            <input class="form-check-input" type="checkbox" value="" id="form2Example31" checked/>*/}
        {/*            <label class="form-check-label" for="form2Example31"> Remember me </label>*/}
        {/*        </div>*/}
        {/*    </div>*/}

        {/*    <div class="col">*/}

        {/*        <a href="#!">Forgot password?</a>*/}
        {/*    </div>*/}
        {/*</div>*/}


        <button type="submit" className="btn btn-primary btn-block mb-4">Zaloguj
        </button>



    </form>
        {error && <p>{error}</p>}
    </div>
    );
};

export default Login;
