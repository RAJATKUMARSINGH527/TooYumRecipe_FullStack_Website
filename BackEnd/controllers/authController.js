const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
require("dotenv").config();

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        //environment variables always return string so we need to convert it to number
        bcrypt.hash(
          password,
          Number(process.env.SALT_ROUNDS),
          async (err, hash) => {
            if (err) {
              res.json({ err });
            }
            const user = new UserModel({ username, email, password: hash });
            await user.save();
            res
              .status(201)
              .send({
                message: "You have been Successfully Registered!",
                user: user,
              });
          }
        );
      } catch (err) {
        res.status(400).send(err);
      }
};

exports.login = async (req, res) => {
    console.log("Login request received:", req.body); // ✅ Log request data

    const { email, password } = req.body;
    try {
      const matchingUser = await UserModel.findOne({ email });
  
      if (!matchingUser) {
        console.log("User not found!");  // ✅ Log this
        return res.status(404).json({ message: "User not found!" });
      }
  
      const isPasswordMatched = await bcrypt.compare(password, matchingUser.password);
      if (!isPasswordMatched) {
        console.log("Invalid email or password!");  // ✅ Log this
        return res.status(400).json({ message: "Invalid email or password!" });
      }
      
      console.log("Generating Token..."); // ✅ Log this

      const token = jwt.sign(
        { userId: matchingUser._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );
  
      console.log("Login successful! Token generated:", token);  // ✅ Log token
      return res.status(200).json({ message: "You have been Successfully Logged in!", token });
  
    } catch (err) {
      console.error("Error during login:", err);  // ✅ Log errors
      return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};
