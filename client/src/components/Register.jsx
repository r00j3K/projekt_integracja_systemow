import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
import Select from "react-select";

const Register = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [date_of_birth, setDate_of_birth] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const roles = [ { value: 'download', label: 'Download' }, { value: 'non-download', label: 'Non-Download'} ]
    const [role, setRole] = useState({ value: '', label: 'Wybierz kategorie...' } )

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/users/register',
                { name, surname, date_of_birth, email, password, role },
                { withCredentials: true }
            );

            navigate('/login');
        } catch (err) {
            setError(err.response.data.message || "Błąd serwera");
        }
    };

    return (
        <Container className="mt-5">
            <h1 className="mb-4 text-center">Wprowadź dane</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3" controlId="formName">
                    <Form.Label column sm={2}>Podaj imię</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Imię" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formSurname">
                    <Form.Label column sm={2}>Podaj nazwisko</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" value={surname} onChange={(e) => setSurname(e.target.value)} required placeholder="Nazwisko" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formDateOfBirth">
                    <Form.Label column sm={2}>Podaj rok urodzenia</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="number" value={date_of_birth} onChange={(e) => setDate_of_birth(e.target.value)} required placeholder="Rok urodzenia" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formEmail">
                    <Form.Label column sm={2}>Podaj email</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formPassword">
                    <Form.Label column sm={2}>Podaj hasło</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="role">
                    <Form.Label column sm={2}>Uprawnienia</Form.Label>
                    <Col sm={10}>
                        <Select
                            options={roles}
                            name="role"
                            value={role}
                            onChange={(selectedOption) => setRole(selectedOption)}
                        />
                    </Col>
                </Form.Group>


                <div className="text-center"    >
                    <Button type="submit" variant="primary" className="mx-2 my-2">Zarejestruj się</Button>
                    <Link to="/login">
                        <Button variant="secondary">Logowanie</Button>
                    </Link>
                </div>
            </Form>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Container>
    );
}

export default Register;
