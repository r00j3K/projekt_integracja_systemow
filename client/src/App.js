import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './components/Start';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import CreateArticle from './components/CreateArticle';
import  { ProtectedRoute } from './ProtectedRoute';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/"  element={<ProtectedRoute elementIfAuthenticated={<Home />} elementIfUnauthenticated={<Start />} />} />
                <Route exact path="/login"  element={<ProtectedRoute elementIfAuthenticated={<Home />} elementIfUnauthenticated={<Login />} />} />
                <Route exact path="/home" element={<ProtectedRoute elementIfAuthenticated={<Home />} elementIfUnauthenticated={<Login/>}/>} />
                <Route exact path="/register" element={<ProtectedRoute elementIfAuthenticated={<Home/>} elementIfUnauthenticated={<Register/>}/>} />
                <Route exact path="/create_article" element={<CreateArticle/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
