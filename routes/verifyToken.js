const jwt = require("jsonwebtoken");


const verifyToken = (req,res,next) => {

    let authHeader = req.headers.token;
    console.log("ritik");
    console.log(authHeader);
    if(authHeader){
        let token = authHeader.split(" ")[1];
        console.log(token);
        jwt.verify(token,process.env.Secret_key,(err,user) => {
            if(err) res.status(403).json("Token is not valid");
            console.log("rajat");
            console.log(user);
            req.user = user;
            next();
        })
    }else{
        return res.status(401).json("you are not authenticated");
    }
}

const verifyTokenAndAuthorization = (req,res,next) => {
    verifyToken(req,res,() => {
        if(req.params.id === req.user.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json("you are not allowed to do that! ");
        }
    });
}

const verifyTokenAndAdmin = (req,res,next) => {
    verifyToken(req,res,() => {
        if(req.user.isAdmin == true){
            next();
        }else{
            return res.status(403).send("you are not the admin");
        }

    })
}


module.exports = {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin};