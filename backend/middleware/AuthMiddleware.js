const jwt = require('jsonwebtoken');

//check user login or not using jwt token
const validateToken = (req, res, next) => {

    const token = req.headers.authorization.split(" ")[1];

    if(!token){
        return res.status(401).json({error: "User not logged in!"})
    }

    try{
        const validToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if(validToken){
            console.log("User logged in")
            next();
        }
    }catch(error){
        console.error("Error validating token:", error);
        return res.status(500).json({error: "Invalid token or internal server error"});
    }
}

module.exports = validateToken;