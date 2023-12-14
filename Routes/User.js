const express = require("express");
const router = express.Router();
const User = require('../Models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthMiddleWare = require("../Middleware/Auth");


// SignUp with username password => returns accesstoken and user object
router.post('/signup', async (req, res) => {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);
	const user = await new User({ ...req.body, password: hashedPassword })
	try {
		const newUser = await user.save();
		const accessToken = jwt.sign({ id: newUser._id, username: newUser.username, email: newUser.email }, "test_jwt")
		res.send({ accessToken, user: newUser })
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

// SignIn with username and password => returns accesstoken
router.post('/signin', async (req, res) => {
	const user = await User.findOne({ username: req.body.username })
	if (!user) {
		return res.status(404).send("Cannot find user!");
	} else {
		try {
			if (await bcrypt.compare(req.body.password, user.password)) {
				const accessToken = jwt.sign({ id: user._id, username: user.username, email: user.email }, "test_jwt")
				res.send({ accessToken })
			} else {
				res.send("Not authorized!")
			}
		} catch (error) {
			res.send(error)
		}
	}
})

// Reset Password => returns message
router.patch('/reset-password', async (req, res) => {
	const user = await User.findOne({ username: req.body.username })
	if (!user) {
		return res.status(404).send({ message: "Cannot find user!" });
	} else {
		try {
			const newHashedPassword = await bcrypt.hash(req.body.password, 10);
			await User.findByIdAndUpdate(user._id, { password: newHashedPassword }, {
				returnOriginal: false
			})
			res.send({ message: "Password Reset Successfully!" })
		} catch (error) {
			res.send(error)
		}
	}
})

// Update user details  => returns updated user
router.patch('/update', AuthMiddleWare, async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.authUser.id })
		if (!user) {
			return res.status(404).send({ message: "Cannot find user!" });
		} else {
			req.body
			const userUpdate = await User.findByIdAndUpdate(user._id, req.body, {
				returnOriginal: false
			})
			res.send(userUpdate)
		}
	} catch (error) {
		res.send(error)
	}
})

module.exports = router;