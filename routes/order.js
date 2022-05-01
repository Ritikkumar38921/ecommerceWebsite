const Order = require("../models/Order");
const {verifyToken,verifyTokenAndAdmin,verifyTokenAndAuthorization} = require("./verifyToken");
const router = require("express").Router();

// Create

router.post('/',verifyToken,async(req,res) => {
    try {
        const neworder = await Order.create({...req.body});
        res.status(200).json(neworder);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Update

router.put("/:id",verifyTokenAndAdmin,async(req,res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,{
            $set:req.body,
        },{ new : true }); 
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Delete 
router.delete("/:id",verifyTokenAndAdmin,async(req,res) => {
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted....");
    }catch(error){
        res.status(500).json(error);
    }
});

// Get User Orders
router.get("/find/:userId",verifyTokenAndAuthorization,async(req,res) => {
    try {
        const orders = await Order.find({ userId : req.params.userId });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get All 
router.get("/",async(req,res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get Monthly Income
router.get("/income",verifyTokenAndAdmin,async(req,res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    console.log(date);
    console.log(lastMonth);
    console.log(previousMonth);
    
    try {
        const income = await Order.aggregate([
            { $match : {createdAt : { $gte : previousMonth }}},
            { $project : {
                 month : { $month : "$createdAt" } ,
                 sales : "$amount",
            },
        },
        {
            $group : {
                _id : "$month",
                total : { $sum : "$sales" },
            },
        },
        ]);
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
