const express = require('express');
const Product = require("../models/product");
const {verifyToken, verifyRoleAdmin} = require("../middlewares/authorization");

const _ = require('underscore');

const app = express();

app.get("/product", verifyToken, (req, res) => {

    const limit = Number(req.params.limit) || 10;
    const offset = Number(req.params.offset) || 0;

    Product.find({status:true})
        .limit(limit)
        .skip(offset)
        .populate("user")
        .populate("category")
        .exec( (err, products) => {

            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }

            res.json({
                ok:true,
                products
            })

        });

});

app.get("/product/:id", verifyToken, (req, res) => {

    const id = req.params.id;

    Product.findById({_id: id})
        .populate("user")
        .populate("category")
        .exec((err, product) => {
        if(err) return res.status(500).json({
            ok:false,
            err
        });

        if(!product){
            return res.status(400).json({
                ok:false,
                message:"product doesnt exist"
            });
        }

        res.json({
            ok:true,
            product
        });

    });

});

app.post("/product", verifyToken, (req, res) => {

    const body = req.body;

    let productModel = new Product();

    productModel.name = body.name;
    productModel.priceUnitary = body.priceUnitary;
    productModel.description = body.description;
    productModel.category = body.category;
    productModel.user = body.user._id;

    productModel.save( (err, productSaved) => {

        if(err) return res.status(500).json({ 
            ok:false,
            err
        });

        if(!productSaved){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            productSaved
        });

    });


});

app.put('/product/:id', verifyToken,(req, res) => {

    const id = req.params.id;
    const body = _.pluck(req.body, ['name', 'priceUnitary', "description", "status", 'category', 'user']);

    Product.findByIdAndUpdate({_id: id}, body, (err, productEdited) => {

        if(err) return res.status(500).json({
            ok:false,
            err
        });

        if(!productEdited){
            return res.status(400).json({
                ok:false,
                message: "product doesnt exist"
            });
        }

        res.json({
            ok:true,
            productEdited
        });

    })

});

app.delete("/product/:id", verifyToken,(req, res)=>{

    const id = req.params.id;

    Product.findOneAndRemove({_id:id}, (err, productDeleted) => {

        if(err) return res.status(500).json({
            ok:false,
            err
        });

        if(!productDeleted){
            return res.status(400).json({
                ok:false,
                message: "product doesnt exist"
            });
        }

        res.json({
            ok:true,
            productDeleted
        });

    });

})

app.get('/product/search/:word', verifyToken, (req, res) => {

    const wordSearch = req.params.word;

    const regex = new RegExp(wordSearch, 'i');

    Product.find({name:regex}, (err, products) => {

        if(err) return res.status(500).json({
            ok:false,
            err
        });

        if(!products){
            return res.status(400).json({
                ok:false,
                message: "product doesnt exist"
            });
        }

        res.json({
            ok:true,
            products
        });

    });

});

module.exports = app;