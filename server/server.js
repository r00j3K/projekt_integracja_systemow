const express = require('express');
const cors = require('cors');
const app = express();

const userRouter = require('./routes/userRouter');
const articleRouter = require('./routes/articleRouter');
const db = require('./db');
const User = require('./models/userModel');
const Article = require('./models/articleModel');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 8080;

const initApp = async () => {
    console.log("Testing the database connection..");

    try {
        await db.authenticate();
        console.log("Connection has been established successfully.");

        await User.sync({ alter: true });
        await Article.sync({ alter: true });

        app.use(cors({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
            allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        }));

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser());
        app.use('/api/users', userRouter);
        app.use('/api/articles', articleRouter);

        // Generowanie secret key
        process.env.SECRET_KEY = require('crypto').randomBytes(64).toString('hex');

        app.listen(PORT, () => {
            console.log(`Server is running at: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

initApp();

module.exports = {
    app
};
