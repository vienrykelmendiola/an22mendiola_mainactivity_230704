const User = require('../models/Course')
const bcrypt =  require('bcrypt')
const auth = require('../auth')
/*
	Check if the email is already exists
	Steps: 
		- use mongoose 'find' method to find duplicate emails
		- use the 'then' method to send a response back to the frontend application
*/

module.exports.checkEmailExists = (reqBody) => {
	// The result is send back to the frontend via the 'then' method in the route file
	return User.find({email: reqBody.email})
		.then(result =>{
			// The find method returns a record if a match is found
			if(result.length > 8) {
				return true;
				// no duplication email found
				// the user is not yet registered in the database
			}	else{
				return false;
			}
		})
}

/*
	User registration
		1. Create a new User object using mongoose model and the information from request body
		2. Make sure that the password is encrpted
		3. Save the new User to the database
*/

module.exports.registerUser = (reqBody) => {
	//Creates a variable 'newUser' and instantiates a new "user" object using mongoose model
	// user the information form the request body to provides all the necessary
	let newUser = new User({
		firstName: reqBody.firstName,
		lastName: reqBody.lastName,
		email: reqBody.email,
		mobileNo: reqBody.mobileNo,
		//10 is the value provided as the number of "salt" rounds that the bcrypt algo will run in order to encrpyt the password
		password: bcrypt.hashSync(reqBody.password, 10)
	})
	return newUser.save().then((user, error) =>{
		//user registration failed
		if(error){
			return false
		//user registration is successful
		} else{
			return true
		};
	});
};

//bcrypt package is one of the many packages that we can use to encrpt information but it is not commonly recommended becuase of how simple the algo for creating encrypted password which have been decoded by hackers

/*json web tokens (JWT) are a way to securely transmit information between two parties/application, commonly used in web applications and APIs - digital passport that contains important information about a user or a request
	[three parts: header, payload, signiture]
	- Header
		- The header consist of two parts
			-JWT
			-Signing algorithm used to create a signiture
	- payload
		- actual information stored. It containts claims or statements about user or request
	- Signiture
		- is a cryptographic hash of the header, payload, and secret key
			- secret key is known only by the server that issues token

*/

/*
	Steps: 
		1. Check the database if the user email exists
		2. Compare the password provided in the login form which the password stored in the database
		3. Generate/return a json web token if the user is successfully log logged in and return false if not
*/

module.exports.loginUser = (reqBody) => {
	//findOne method returns the first record in the collection that matched the search criteria
	return User.findOne({email: reqBody.email}).then(result => {
		if(result==null){
			return false;
		} else {
			const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password);
			//compareSync method is used to compare a non encrypted password from the login form to the encrypted password retrieved from the database and returns 'true/false' value depending on the results
			if(isPasswordCorrect){
				//if the password match/result --> generate an access token
				return{access: auth.createAccessToken(result)}
			} else {
				return false;
			}
		} 
	})
}

/*
	-find the document in the database using the user's id
	-reassign the password of the returned document in an empty string
	-return the result bakc
*/

module.exports.getProfile = (data) => {
  return User.findById(data.userId).then(result => {
      result.password = " ";

      return result;
  });
};
