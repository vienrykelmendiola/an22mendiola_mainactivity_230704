//this file store the methods for creating jsonwebtokens
const jwt = require('jsonwebtoken');
const secret = 'bcsAN22';

module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};
	//Generate a JSON web token using the jwt's sign method
	//Generates the token using the form data and the secret code
	return jwt.sign(data, secret, {})
}