import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './components/Start';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import Home2 from "./components/Home2";
import './App.css';
import logo from './logo.svg';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Start />} />
                <Route exact path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/register" element={<Register />} />


            </Routes>
        </BrowserRouter>
    );
}

export default App;
