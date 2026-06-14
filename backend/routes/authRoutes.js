const express = require("express");
const router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {

    try {

        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({
            message: "User Registered"
        });

    } catch (error) {

        console.log("REGISTER ERROR:");
        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

});

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user =
            await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: "User Not Found"
            });

        }

        const match =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!match) {

            return res.status(400).json({
                message: "Wrong Password"
            });

        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET
        );

        res.json({ token });

    } catch (error) {

        console.log("LOGIN ERROR:");
        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;