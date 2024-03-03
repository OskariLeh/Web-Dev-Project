const jwt = require("jsonwebtoken");

// Authentication for jwt
module.exports = function(req, res, next) {
    const authHeader = req.headers["authorization"];
    let token;
    if(authHeader) {
        token = authHeader.split(" ")[1];
    } else {
        token = null;
    }
    if(token == null) return res.sendStatus(401);
    console.log(token);
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    });


    
};