const router = require("express").Router();
const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post('/register',async (req,res) => {
    let {username,email,password,isAdmin} = req.body;
    if(!username || !email || !password){
        return res.status(300).send("please enter your details clearly");
    }

    try{
        console.log(req.body.password);
        let salt = await  bcrypt.genSalt();
        req.body.password = await bcrypt.hash(req.body.password,salt);
        let admin = true
        if(req.body.isAdmin === undefined)
            admin = false;
        let user = await User.create({username:req.body.username,email:req.body.email,password:req.body.password,isAdmin:admin});

        if(!user){
            return res.status(500).send("internal server error");
        }
        

        const {password,...others} = user._doc;
        console.log(user);
        res.status(200).json({...others});
    }catch(err) {
        res.status(500).json({message:"something went wrong",error:err});
    }

});

router.post('/login',async (req,res) => {
    try{
        console.log(req.url);
        let {username,password} = req.body;
        if(!username || !password){
            res.status(500).send("please enter right credential");
        }

        let user = await User.findOne({username});
        if(!user){
            console.log("such a user is not found in the database")
            return res.status(404).send("such a user is not found in the database")
        }
        console.log(user);
        console.log("password : ",password);
        console.log("database password : ",user.password);
        let flag = await bcrypt.compare(password,user.password);
        console.log(flag);
        if(flag == false){
            return res.status(300).send("invalid Credential");
        }

        let payload = user._id;
        let signature = await jwt.sign({id:payload,isAdmin:user.isAdmin},process.env.Secret_Key);
        console.log(signature);
        res.status(200).json({
            message:"successful",
            signature,
            userId:payload,
            isAdmin:user.isAdmin,
        });
    }catch(error){
        res.status(500).send(error);
    }
})

module.exports = router;