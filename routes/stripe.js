const router = require("express").Router();
const Stripe = require("stripe");
const stripe = Stripe((process.env.Stripe_Key));
const  {uuid} = require("uuidv4");
const express = require('express');
const { json } = require("express");




router.post("/payment",(req,res) => {
    // let obj = JSON.parse(req.body);
    // console.log(obj);

    // console.log(req.body);
    // // console.log(req.header);
    // console.log(req.headers);
    // console.log(req.rawHeaders);
    
    const {product , token } =  req.body;
    console.log("Product : ",product);
    console.log("Price : ", product);
    const idempotentencyKey = uuid();
    return stripe.customers.create({
        email:token.email,
        source:token.id
    }).then((customer) => {
        stripe.charges.create({
            amount : product.amount * 100,
            currency : "usd",
            customer : customer.id,
            discription : `purchase of products`,
            shipping:{
                name : token.card.name,
                address:{
                    country: token.card.address_country
                }
            }
        },{idempotentencyKey})
    }).then(result => res.status(200).json(result))
    .catch(err => console.log(err));
})



// router.post("/payment",(req,res) => {

//     const {product,token} = req.body;
//     console.log("Product : ",product);
//     console.log("Price" ,product.amount);
//     console.log(token);

//     stripe.charges.create({
//         source : token.id,
//         amount : product.amount,
//         currency:"usd",
//         description:"purchasing the product ",
//         customer : 
//         shipping:{
//             name : token.card.address_city,
//         }
//     },
//     (stripeErr,stripeRes) => {
//         if(stripeErr){
//             res.status(500).json(stripeErr);
//         }else{
//             res.status(200).json(stripeRes);
//         }
//         }
//     );
// });


// primary key for frontend side for stripe
// pk_test_51Ks0Z7SCeb6qOjoeEkFbzgcwF9R8af2k7rL6LbfT0R6rHJaI5cjn43jekssjc25RmLNosl2WOMqfRARPRdaSSjRi00xwO6iTKY
module.exports = router;
