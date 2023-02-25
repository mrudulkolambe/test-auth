const jwt = require("jsonwebtoken")


const AuthMiddleWare = (req, res, next) => {
	if (req?.headers?.authorization) {
		const data = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
		req.authUser = data
		next();
	}else{
		res.send("Unauthorized Access!");
	}
}

module.exports = AuthMiddleWare