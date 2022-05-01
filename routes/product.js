const Product = require("../models/Product");
const router = require("express").Router();
const {verifyToken,verifyTokenAndAdmin,verifyTokenAndAuthorization} = require("./verifyToken");
// const {upload}  = require("../index");
// const multer = require("multer");
const path = require("path");
const multer = require('multer');
// Create

let upload;

    let storage = multer.diskStorage({
        destination:(req,file,cb)=>{
            console.log("diskStorage")
            // console.log(req);
            // console.log("file at destination");
            // console.log(file);
           cb(null,'../server/public/images');
        },
        filename:(req,file,cb) => {
            // console.log(req);
            // console.log("filename ");
            // console.log(file);
            cb(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname));
          }
    });
    
     upload = multer({storage:storage});


router.post("/",verifyTokenAndAdmin,upload.single('myfile'),async(req,res) => {
            try{
                // console.log(req.body);
                let obj = req.body;
                obj.myfile = req.file.filename;
                // console.log(obj);
                // console.log(req.file.filename);
                obj.color = obj.color.split(" ");
                obj.price = Number(obj.price);
                obj.inStock = (obj.inStock === 'true')?true:false;
                obj.categories = obj.categories.split(" ");
                obj.size = obj.size.split(" ");
                let newObj = {color:obj.color,categories:obj.categories,size:obj.size,inStock:obj.inStock,price:obj.price,desc:obj.desc,title:obj.title,img:obj.myfile};
                // console.log(newObj);
                let prod = await Product.create(newObj);
                // console.log(prod);
                if(!prod){
                    return res.status(500).send("something went wrong while putting the data into the product model");
                }
                // let cat = obj.cate;
                // let prod = await Product.create({...obj});
                // if(!prod){
                //     return res.status(500).send("something went wrong while putting the data into the product model");
                // }
                 res.status(200).send("everything is all right");
            }catch(error){
                res.status(500).send("image is not uploaded on the server ");
            }
});

// Update
router.put("/:id",verifyTokenAndAdmin,async(req,res) => {
    try {
        let {size,color,inStock,price } =  req.body;
        req.body.size = size.split(" ");
        req.body.color = color.split(" ");
        req.body.inStock = (inStock === "true")?true:false;
        req.body.price = Number(price);
        let updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
            $set:req.body,
        },{new:true});
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Delete 
router.delete("/:id",verifyTokenAndAdmin,async(req,res) => {
    try {
        let deletedProduct = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get Product
router.get("/find/:id",async(req,res) => {
    try {
        console.log("ritik");
        const product = await Product.findById(req.params.id);
       console.log(product);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get All Products
router.get("/",async(req,res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    console.log(qCategory);
    try {
        let products;

        if(qNew){
            products = await Product.find().sort({createdAt : -1}).limit(1);
        }else if(qCategory){
            products = await Product.find({
                categories : {
                    $in : [qCategory],
                }
            });
        }else{
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error);
        
    }
});

module.exports = router;