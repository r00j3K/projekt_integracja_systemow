import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Start = () => {
    return (
        <Container className="d-flex flex-column justify-content-between align-items-center min-vh-100">
            <Row className="mb-4 mt-4">
                <Col className="text-center">
                    <Image src={require('./src/tag_logo.png')} width={250} fluid />
                </Col>
            </Row>
            <Row>
                <Col className="d-flex flex-column align-items-center">
                    <Link to="/login">
                        <Button variant="primary" size="lg" className="my-2">Logowanie</Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="outline-primary" size="lg" className="my-2">Rejestracja</Button>
                    </Link>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col className="text-center">
                    <p>Created by Dawid Rutkowski & Adrian Rojek</p>
                </Col>
            </Row>
        </Container>
    );
};

export default Start;
