const express = require("express");
const { register, login ,getAllUsers,getAllUsersById } = require("../controllers/authController");
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/users",getAllUsers)
authRouter.get("/user/:id",getAllUsersById)

module.exports = {authRouter};
