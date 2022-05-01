const {verifyTokenAndAuthorization,verifyTokenAndAdmin} = require("./verifyToken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = require("express").Router();

// Update User
router.put("/:id",verifyTokenAndAuthorization,async (req,res) => {
    if(req.body.password){
        let salt = await  bcrypt.genSalt();
        req.body.password = await bcrypt.hash(req.body.password,salt);
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true}); 
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err);
    }
})

// Delete a user
router.delete("/:id",verifyTokenAndAdmin,async (req,res)=>{
    try{
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        res.status(200).send(deletedUser);
    }catch(err){
        res.status(500).send(err);
    }
});

// Get a user 

router.get("/find/:id",verifyTokenAndAdmin,async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        res.status(200).send(user);
    }catch(err){
        res.status(500).send(err);
    }
});


// get all Users 

router.get("/",verifyTokenAndAdmin,async (req,res)=>{
    try{
        let query = req.query.new;
        console.log("mami");
        console.log(query);
        const users = (query)? await User.find({}).sort({_id:-1}).limit(3):await User.find({});
        res.status(200).send(users);
    }catch(err){
        res.status(500).send(err);
    }
});

// get stats 

router.get("/stat",verifyTokenAndAdmin,async (req,res) => {
    
    try{
        let date = new Date();
        let lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
        console.log(date);
        console.log(lastYear);
        let data = await User.aggregate([
           { $match : { createdAt : { $gte : lastYear } } },
           { $project : { month : { $month : "$createdAt"} } },
           { $group : {
                _id:"$month" , total : {"$sum" : 1 },
            },
        } 
        ]);
        res.status(200).send(data);
    }catch(err){
        res.status(500).send(err);
    }
});

module.exports = router;