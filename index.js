const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()

const app = express();
const port = 1000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(bodyParser.json())

const userRouter = require('./Routes/User');
app.use("/user", userRouter)

app.use(cors({
	origin: ['*', "http://localhost:3000/", "http://localhost:3000"]
}));


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
	.then(() => console.log("Connected to db"))
	.catch((err) => console.log(err))


app.get('/', (req, res) => {
	res.send('Hello World!')
})


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})