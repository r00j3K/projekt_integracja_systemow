const userController = require('../controllers/userController');
const express = require("express");
const userRouter = express.Router();

userRouter.post("/register", userController.addUser);
userRouter.get('/allUsers', userController.getAllUsers);
userRouter.get('/getUser/:id', userController.getOneUser);
userRouter.put("/updateUser/:id", userController.updateUser);
userRouter.delete("/deleteUser/:id", userController.deleteUser);
userRouter.post('/login', userController.login);
userRouter.post('/logout', userController.logout)


module.exports = userRouter;
