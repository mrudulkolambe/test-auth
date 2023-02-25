const mongoose = require('mongoose');
const { Schema } = mongoose;

const USER_SCHEMA = new Schema({
	firstname: String,
	lastname: String,
	email: {
		required: true,
		type: String,
		trim: true,
		validate: {
			validator: function (v) {
				return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
			},
			message: props => `${props.value} is not a valid email!`
		}
	},
	photoURL: String,
	password: {
		type: String,
		required: true
	},
	username: {
		type: String,
		unique: true,
		required: false
	}
});


module.exports = mongoose.model("USER", USER_SCHEMA);