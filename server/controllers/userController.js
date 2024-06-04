const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()
const saltRounds = 10;
const axios = require('axios');
const sequelize = require('../db');

const login = async (req, res) => {
    try {
        // Znalezienie użytkownika o podanym emailu
        let user = await User.findOne({where: {email: req.body.email}});

        if (!user) {
            return res.status(400).send({ message: 'Nie istnieje konto użytkownika o podanym e-mailu' });
        }

        // Sprawdzenie hasła
        let passOk = await bcrypt.compare(req.body.password, user.password);

        if (!passOk) {
            return res.status(400).send({ message: 'Błędne hasło' });
        }

        // Wygenerowanie JWT tokena, niezbędnego do autoryzacji użytkownika
        let token = await jwt.sign({id: user.id, email: user.email}, process.env.SECRET_KEY, {expiresIn: '1h'});

        //nie moze byc httpOnly true, bo wtedy JS na froncie nie widzi cookie
        res.cookie('jwt', token);
        res.cookie('id', user.id, { httpOnly: true });

        // Generowanie Wykop Bearer tokenu do późniejszego pobierania artykułów
        const response = await axios.post('https://wykop.pl/api/v3/auth', {
            "data": {
                "key": "w5f807c2f6392704a757a544b66db349b7",
                "secret": "f3d28f0c7027e33ee0e5bfc65affcf9e"
            }
        });

        // Zapisanie Bearer tokena
        const wykopToken = response.data.data.token;

        // Zapisanie tokena w ciasteczku
        res.cookie('wykopToken', wykopToken, {
            httpOnly: true
        });

        res.send("Logowanie powiodlo sie ");
    } catch (err) {
        res.status(500).send({ message: "Błąd: " + err });
    }
};


const logout = async (req, res) => {
    //usuniecie jwt tokenu i wykopTokenu z cookies
    res.clearCookie('jwt');
    res.clearCookie('wykopToken');
    res.clearCookie('id');
    res.send("Wylogowano");
    //po stworzeniu fronta dodac przekierowanie do strony logowania
}

const tokenValidation = async (req, res, next) => {
    //pobranie tokenu z cookies
    const token = req.cookies.jwt;
    console.log(token)

    //walidacja dostepu na podstawie tokenu i SECRET_KEY tworzonego przy uruchamianiu serwera
    if(!token){
        res.status(400).send("Brak dostępu, błędny token");
    }else{
        try{
            const result= await jwt.verify(token, process.env.SECRET_KEY);
            next();
        }catch(err){
            res.status(401).send("Nieprawidłowy lub nieważny token");
        }
    }
}

const frontTokenValidation = async (req, res, next) => {
    //pobranie tokenu z cookies
    const token = req.cookies.jwt;
    console.log(token)

    //walidacja dostepu na podstawie tokenu i SECRET_KEY tworzonego przy uruchamianiu serwera
    if(!token){
        res.status(400).send("Brak dostępu");
    }else{
        try{
            const result= await jwt.verify(token, process.env.SECRET_KEY);
            res.status(200).send(result);
        }catch(err){
            res.status(401).send("Nieprawidłowy lub nieważny token");
        }
    }
}



const addUser = async (req, res) => {
    const t = await sequelize.transaction();
    try {

        // Pobranie informacji o użytkowniku
        const { name, surname, date_of_birth, email, password } = req.body;
        const role = req.body.role.value;

        // Sprawdzenie, czy użytkownik z podanym e-mailem już istnieje
        const existingUser = await User.findOne({ where: { email }, transaction: t });
        if (existingUser) {
            await t.rollback();
            return res.status(400).send({ message: 'Email jest juz w użyciu' });
        }

        if (date_of_birth < 1950 || date_of_birth > 2024) {
            await t.rollback();
            return res.status(400).send({ message: 'Nieprawidłowa data urodzenia' });
        }

        // Zaszyfrowanie hasła
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Przygotowanie danych użytkownika
        let info = {
            email: email,
            password: hashedPassword,
            name: name,
            surname: surname,
            date_of_birth: date_of_birth,
            role: role
        };

        // Wykorzystanie modelu User do dodania go do bazy danych
        const user = await User.create(info, { transaction: t });

        await t.commit();
        res.status(200).send(user);
    } catch     (error) {
        await t.rollback();
        res.status(500).send({ message: 'Bład rejestracji uzytkownika', error: error.message });
    }
};
const getAllUsers = async (req, res) => {
    let users = await User.findAll();
    res.status(200).send(users);
}

const getOneUser = async (req, res) => {
    let id = req.params.id;
    let info = await User.findOne({ where: {id: id}});
    res.status(200).send(info);
}


const updateUser = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        let id = req.params.id;
        const user = await User.update(req.body, { where: { id: id }, transaction: t });
        await t.commit();
        res.status(200).send(user);
    } catch (error) {
        await t.rollback();
        res.status(500).send({ message: 'Błąd edycji uźytkownika', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        let id = req.params.id;
        await User.destroy({ where: { id: id }, transaction: t });
        await t.commit();
        res.status(200).send("user is deleted");
    } catch (error) {
        await t.rollback();
        res.status(500).send({ message: 'Error deleting user', error: error.message });
    }
};

const downloadVerification = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.cookies.id } });
        if (user) {
            if (user.role === 'download') {
                console.log("Eligible for downloading");
                next();
            } else {
                res.status(400).json({ message: 'Nie masz uprawnień do pobierania plików' });
            }
        } else {
            res.status(404).send({ message: 'Nie znaleziono użytkownika' });
        }
    } catch (err) {
        res.status(500).send({ message: 'Błąd serwera', error: err.message });
    }
};



module.exports = {
    addUser,
    getAllUsers,
    getOneUser,
    updateUser,
    deleteUser,
    login,
    tokenValidation,
    logout,
    frontTokenValidation,
    downloadVerification
};